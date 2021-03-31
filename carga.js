const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const env = require('dotenv');
const mongoose = require('mongoose');
env.config({ path: './env/simulador.env' });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: false });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

require('./src/models/Rodada')
require('./src/models/Time')
require('./src/models/Partida')

const Rodada = mongoose.model('Rodada');
const Time = mongoose.model('Time');
const Partida = mongoose.model('Partida');

const cadastrarTimes = async () => {
    
    const times = JSON.parse(fs.readFileSync('./database/times.json', 'utf8'));
    let instanciasTimes = [];

    times.map((time=>{
        instanciasTimes.push(new Time({nome: time.nome, sigla: time.sigla}));
    }));

    Time.insertMany(instanciasTimes, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação dos times");
        }else{
            console.log(`${docs.length} Times inseridos com sucesso.`);
        }
    });
}

const cadastrarRodadas = async () => {
    const rodadas = JSON.parse(fs.readFileSync('./database/rodadas.json', 'utf8'));
    let instanciasRodadas = [];

    rodadas.map((rodada=>{
        instanciasRodadas.push(new Rodada({numero: rodada.numero, partidas: rodada.partidas}));
    }));

    Rodada.insertMany(instanciasRodadas, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação das rodadas");
        }else{
            console.log(`${docs.length} Rodadas inseridas com sucesso.`);
        }
    });
}

const cadastrarPartidas = async (numeroRodada, partidas) => {
    await Partida.insertMany(partidas, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação das partidas da rodada " + numeroRodada);
        }else{
            console.log(`${docs.length} Partidas inseridas com sucesso.`);
        }
    });

    let rodada = await Rodada.findOne({'numero': numeroRodada});
    let partidasDaRodada = await Partida.find({rodada: numeroRodada});
    rodada.partidas = partidasDaRodada;
    await rodada.save();
}

cadastrarTimes();
cadastrarRodadas();

const url = 'https://www.goal.com/br/not%C3%ADcias/tabela-do-brasileirao-2021-veja-todos-os-jogos-do-campeonato/ti0dzl8zwfg11rxv636psj9ze';
console.log("iniciando web scraping ... ")

axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const listaPartidas = $('.body').find('ul').slice(1);
    var partidas = [];
    console.log("HTML capturado ... ")
    console.log("Iniciando insert de partidas ... ")

    listaPartidas.each(function(index){
        partidas = [];
        for(let i = 0; i < 10; i++) {
            let textoRodada = $(this).find('li')[i].children[0].data.trim();
            let textoTimes = textoRodada.split(" x ");
            console.log(textoTimes);
            partidas.push(
                new Partida({
                    time_casa: textoTimes[0],
                    time_visitante: textoTimes[1],
                    rodada: index+1
                })
            );
        }
        cadastrarPartidas(index+1, partidas);
        console.log("\n");
    });
}).catch(console.error);

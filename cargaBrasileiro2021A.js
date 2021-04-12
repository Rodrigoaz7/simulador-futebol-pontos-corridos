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

require('./src/models/Rodada');
require('./src/models/Time');
require('./src/models/Partida');
require('./src/models/Campeonato');

const Rodada = mongoose.model('Rodada');
const Time = mongoose.model('Time');
const Partida = mongoose.model('Partida');
const Campeonato = mongoose.model('Campeonato');

const cadastrarCampeonato = async () => {
    
    const campeonatos = JSON.parse(fs.readFileSync('./database/campeonatos.json', 'utf8'));
    let instanciasCampeonatos = [];

    campeonatos.map((camp=>{
        instanciasCampeonatos.push(
            new Campeonato({nome: camp.nome, codigo: camp.codigo, 
                ano: camp.ano, rodada_atual: camp.rodada_atual})
        );
    }));

    await Campeonato.insertMany(instanciasCampeonatos, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação dos campeonatos");
        }else{
            console.log(`${docs.length} Campeonatos inseridos com sucesso.`);
        }
    });
}

const cadastrarTimes = async (campeonato) => {
    
    const times = JSON.parse(fs.readFileSync('./database/times.json', 'utf8'));
    let instanciasTimes = [];

    times.map((time=>{
        instanciasTimes.push(new Time({nome: time.nome, sigla: time.sigla, campeonato: campeonato._id}));
    }));

    await Time.insertMany(instanciasTimes, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação dos times");
        }else{
            console.log(`${docs.length} Times inseridos com sucesso.`);
        }
    });
}

const cadastrarRodadaComPartidas = async (campeonato, numeroRodada, partidas) => {
    await Partida.insertMany(partidas, (err, docs) => {
        if(err){
            console.log("Aconteceu um erro na gravação das partidas da rodada " + numeroRodada);
        }else{
            console.log(`${docs.length} Partidas inseridas com sucesso.`);
            const rodada = new Rodada({numero: numeroRodada, partidas: docs, campeonato: campeonato._id});
            rodada.save();
            console.log(`Rodada ${numeroRodada} inserida com sucesso.`)
        }
    });
}

const cadastrarDados = async () => {
    console.log("Iniciando cadastro de dados ...")
    await cadastrarCampeonato();
    const campeonato = await Campeonato.findOne({codigo: "BRA2021A"});
    await cadastrarTimes(campeonato);
    
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
            cadastrarRodadaComPartidas(campeonato, index+1, partidas);
            console.log("\n");
        });
    }).catch(console.error);
}

cadastrarDados();



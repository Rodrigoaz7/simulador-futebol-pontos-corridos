const axios = require('axios');
const cheerio = require('cheerio');
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

    const campeonato = new Campeonato({
        "nome": "Campeonato Brasileiro Série B",
        "ano": 2021,
        "codigo": "BRA2021B",
        "rodada_atual": 1,
        "itens_desempate": "P-NV-SG-GP"
    });

    await campeonato.save()
    console.log(`Campeonato inserido com sucesso.`);
}

const cadastrarTimes = async (times) => {
    await Time.insertMany(times, (err, docs) => {
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
    const campeonato = await Campeonato.findOne({codigo: "BRA2021B"});
    
    const url = 'https://www.goal.com/br/not%C3%ADcias/brasileirao-serie-b-2021-quando-comeca-times-participantes-e/2dxyt9if2ps112wqy3yj2hp44';
    console.log("iniciando web scraping ... ")

    axios(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const listaPartidas = $('.body').find('ul').slice(2);
        var partidas = [];
        var times = [];
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

                if(index == 0) {
                    times.push(
                        new Time({
                            nome: textoTimes[0],
                            campeonato: campeonato._id
                        })
                    );
                    times.push(
                        new Time({
                            nome: textoTimes[1],
                            campeonato: campeonato._id
                        })
                    );
                }
            }

            if(index == 0) cadastrarTimes(times);
            cadastrarRodadaComPartidas(campeonato, index+1, partidas);
            console.log("\n");
        });
    }).catch(console.error);
}

cadastrarDados();



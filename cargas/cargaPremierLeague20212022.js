const axios = require('axios');
const cheerio = require('cheerio');
const env = require('dotenv');
const mongoose = require('mongoose');
env.config({ path: '../env/simulador.env' });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: false });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

require('../src/models/Rodada');
require('../src/models/Time');
require('../src/models/Partida');
require('../src/models/Campeonato');

const Rodada = mongoose.model('Rodada');
const Time = mongoose.model('Time');
const Partida = mongoose.model('Partida');
const Campeonato = mongoose.model('Campeonato');

const cadastrarCampeonato = async () => {

    const campeonato = new Campeonato({
        "nome": "Premier League",
        "ano": "2021/2022",
        "codigo": "PREMIERLEAGUE20212022",
        "rodada_atual": 1,
        "itens_desempate": "P-SG-GP"
    });

    await campeonato.save();
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
    const campeonato = await Campeonato.findOne({codigo: "PREMIERLEAGUE20212022"});
    let partidas = [];
    let times = [];
    console.log("iniciando web scraping ... ")

    let url = 'https://resultados.as.com/resultados/futbol/inglaterra/calendario/';

    await axios(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        let idRodada = "";
        console.log("Começando a ler as tabelas ...");

        for(let rodada = 1; rodada <= 38; rodada++) {
            idRodada = "#jornada-" + String(rodada);
            console.log("#Rodada " + idRodada);
            const divRodada = $(idRodada);
            const tbodyRodada = divRodada[0].children[3].children[1].children[7];

            tbodyRodada.children.forEach(tr => {
                if(tr.name == "tr") {
                    let equipeMandante = tr.children[1].children[1].children[1].children[0].data;
                    let equipeVisitante = tr.children[5].children[1].children[3].children[0].data;
                    console.log(equipeMandante + " x " + equipeVisitante);
                    if(rodada == 1) {
                        times.push(new Time({nome: equipeMandante, campeonato: campeonato._id}));
                        times.push(new Time({nome: equipeVisitante, campeonato: campeonato._id}));
                    }
                    partidas.push(
                        new Partida({
                            time_casa: equipeMandante,
                            time_visitante: equipeVisitante,
                            rodada: rodada
                        })
                    );
                }
            });

            if(rodada == 1) cadastrarTimes(times);
            cadastrarRodadaComPartidas(campeonato, rodada, partidas);
            partidas = [];
            console.log("\n")  
        }
    }).catch(error => {
        console.log("Deu ruim :/ " + error)
    });
}

cadastrarDados();
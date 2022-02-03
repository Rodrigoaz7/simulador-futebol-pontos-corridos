const axios = require('axios');
const cheerio = require('cheerio');
const env = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const { type } = require('express/lib/response');
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
        "nome": "Campeonato Brasileiro Série A",
        "ano": "2022",
        "codigo": "BRA2022A",
        "rodada_atual": 1,
        "itens_desempate": "P-NV-SG-GP"
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

function linhaInformativaDeRodada(index) {
    return index % 12 == 0;
}

const cadastrarDados = async () => {
    console.log("Iniciando cadastro de dados ...")
    await cadastrarCampeonato();
    const campeonato = await Campeonato.findOne({codigo: "BRA2022A"});
    
    const arquivo = "brasileiroseriea2022.txt";
    console.log("iniciando leitura de arquivo ... ")

    var listaPartidas = fs.readFileSync(arquivo,'utf8').split("\n");
    var partidas = [];
    var times = [];
    let rodada = 0;

    for(var i = 0; i < listaPartidas.length; i++) {
        
        if(linhaInformativaDeRodada(i)) {
            rodada++;
            continue
        }

        let partida = listaPartidas[i];
        let textoTimes = partida.split(" x ");

        if(textoTimes[0] && textoTimes[1]) {
            partidas.push(
                new Partida({
                    time_casa: textoTimes[0],
                    time_visitante: textoTimes[1],
                    rodada: rodada
                })
            );

            if(i > 0 && i < 11) {
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

        if(linhaInformativaDeRodada(i+1)) {
            cadastrarTimes(times);
            cadastrarRodadaComPartidas(campeonato, rodada, partidas);
            partidas = []
        }

    }
}

cadastrarDados();



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
        "nome": "Eliminatórias Sulamericana",
        "ano": 2022,
        "codigo": "ELIMSULAMER2022",
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
    const campeonato = await Campeonato.findOne({codigo: "ELIMSULAMER2022"});
    
    const url = 'https://pt.wikipedia.org/wiki/Eliminat%C3%B3rias_da_Copa_do_Mundo_FIFA_de_2022_%E2%80%93_CONMEBOL';
    console.log("iniciando web scraping ... ")

    axios(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const div = $('.mw-parser-output > div')[2].children;
        let partidas = [];
        let times = [];
        let rodadaAtual = 0;
        
        for(let i = 5; i < 422; i++) {
            if(div[i].name == "h3") {
                rodadaAtual++;
                cadastrarRodadaComPartidas(campeonato, rodadaAtual, partidas);
                partidas = [];

                try {
                    console.log("Raspando " + div[i].children[0].children[0].data + " ..............");
                } catch (error) {
                    console.log("Raspando próxima rodada ..............");
                }
            }

            if(div[i].name == "table") {
                const timeCasa = div[i].children[1].children[0].children[3].children[0].children[0].children[0].data;
                const timeVisitante = div[i].children[1].children[0].children[7].children[0].children[2].children[0].data;
                console.log(timeCasa + " x " + timeVisitante);

                partidas.push(
                    new Partida({
                        time_casa: timeCasa,
                        time_visitante: timeVisitante,
                        rodada: i-4
                    })
                );

                if(i >= 5 && i < 25) {
                    times.push(
                        new Time({
                            nome: timeCasa,
                            campeonato: campeonato._id
                        })
                    );
                    times.push(
                        new Time({
                            nome: timeVisitante,
                            campeonato: campeonato._id
                        })
                    );
                }
            }
        }
        console.log("\n");
        console.log("Quantidade de times Minerados: " + times.length);
        console.log("Quantidade de partidas Minerados: " + partidas.length);

        cadastrarTimes(times);
    });
}

cadastrarDados();
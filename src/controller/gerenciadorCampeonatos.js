const mongoose = require('mongoose');
require('../models/Rodada')
require('../models/Time')
require('../models/Campeonato')
const Rodada = mongoose.model('Rodada');
const Time = mongoose.model('Time');
const Campeonato = mongoose.model('Campeonato');
const ObjectID = require('mongodb').ObjectID

exports.getDadosCampeonatoCompleto = async (campeonatoId) => {
    const campeonato = await Campeonato.findById(campeonatoId);
    if(campeonato == null) return null;

    const times = await Time.find({campeonato: new ObjectID(campeonatoId)}).sort('nome');
    const rodadas = await Rodada.find({campeonato: new ObjectID(campeonatoId)}).sort('numero')
        .populate({ path: 'partidas' })
        .exec();

    return {campeonato: campeonato, times: times, rodadas: rodadas};
};

exports.atualizarCampeonato = async (campeonatoId, data) => {
    let campeonato = await Campeonato.findOneAndUpdate({_id: new ObjectID(campeonatoId)}, data);
    campeonato = await Campeonato.findById(campeonatoId);
    return campeonato;
}

exports.atualizarPartidas = async (campeonatoId, data) => {

    if(data.rodada != 0) {
        const campeonato = await Campeonato.findById(campeonatoId);
        if(campeonato == null) return "Campeonato Não Encontrado";
        let times = await Time.find({campeonato: new ObjectID(campeonatoId)});
        if(times == null) return "Nenhum Time Foi Encontrado";
        const rodada = await Rodada.findById(data.rodada).populate({ path: 'partidas' }).exec();
        if(rodada == null) return "Rodada Não Encontrada";
        let partidas = rodada.partidas;
        partidas.forEach(async partida => {
            // Se a partida teve os dados preenchidos
            placar_time_casa = data[partida.time_casa.trim()];
            placar_time_visitante = data[partida.time_visitante.trim()];
            if(placar_time_casa && placar_time_visitante) {
                // Se a partida ainda não havia sido cadastrada anteriormente
                if(partida.gols_time_casa == null && partida.gols_time_visitante == null) {
                    partida.gols_time_casa = parseInt(placar_time_casa);
                    partida.gols_time_visitante = parseInt(placar_time_visitante);
                    await partida.save()

                    let equipeMandante = times.filter(el => {
                        return el.nome.trim() == partida.time_casa.trim()
                    })[0];
                    let equipeVisitante = times.filter(el => {
                        return el.nome.trim() == partida.time_visitante.trim()
                    })[0];
                    
                    placar_time_casa = data[partida.time_casa.trim()];
                    placar_time_visitante = data[partida.time_visitante.trim()];

                    equipeMandante.gols_pro += parseInt(placar_time_casa);
                    equipeMandante.gols_contra += parseInt(placar_time_visitante);
                    equipeMandante.saldo_gols += parseInt(placar_time_casa) - parseInt(placar_time_visitante);
                    equipeVisitante.gols_pro += parseInt(placar_time_visitante);
                    equipeVisitante.gols_contra += parseInt(placar_time_casa);
                    equipeVisitante.saldo_gols += parseInt(placar_time_visitante) - parseInt(placar_time_casa);

                    if(placar_time_casa > placar_time_visitante) {
                        equipeMandante.n_vitorias += 1;
                        equipeMandante.n_jogos += 1;
                        equipeMandante.pontuacao += 3;
                        equipeVisitante.n_jogos += 1;
                        equipeVisitante.n_derrotas += 1;
                    }

                    if(placar_time_casa < placar_time_visitante) {
                        equipeVisitante.n_vitorias += 1;
                        equipeVisitante.n_jogos += 1;
                        equipeVisitante.pontuacao += 3;
                        equipeMandante.n_jogos += 1;
                        equipeMandante.n_derrotas += 1;
                    }

                    if(placar_time_casa == placar_time_visitante) {
                        equipeVisitante.n_empates += 1;
                        equipeVisitante.n_jogos += 1;
                        equipeVisitante.pontuacao += 1;
                        equipeMandante.n_empates += 1;
                        equipeMandante.n_jogos += 1;
                        equipeMandante.pontuacao += 1;
                    }

                    await equipeMandante.save();
                    await equipeVisitante.save();
                }   
               
            }
        });
        return null;
    }
    return null;
}
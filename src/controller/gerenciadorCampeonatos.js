const mongoose = require('mongoose');
require('../models/Rodada')
require('../models/Time')
require('../models/Partida')
require('../models/Campeonato')
const Rodada = mongoose.model('Rodada');
const Partida = mongoose.model('Partida');
const Time = mongoose.model('Time');
const Campeonato = mongoose.model('Campeonato');
const ObjectID = require('mongodb').ObjectID

exports.getDadosCampeonatoCompleto = async (codigoCampeonato) => {
    const campeonato = await Campeonato.findOne({codigo: codigoCampeonato});
    if(campeonato == null) return null;

    const times = await Time.find({campeonato: campeonato._id}).sort('nome');
    const rodadas = await Rodada.find({campeonato: campeonato._id}).sort('numero')
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
    const campeonato = await Campeonato.findById(campeonatoId);
    return campeonato;
}
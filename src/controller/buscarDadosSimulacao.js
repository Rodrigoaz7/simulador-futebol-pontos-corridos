const mongoose = require('mongoose');
require('../models/Rodada')
require('../models/Time')
require('../models/Campeonato')
require('../models/Partida')
const Rodada = mongoose.model('Rodada');
const Time = mongoose.model('Time');
const Campeonato = mongoose.model('Campeonato');

exports.obterTimes = async (campeonatoId) => {
    const times = await Time.find({campeonato: campeonatoId}).select('-_id').select('-campeonato').sort('nome');
    let timesComDadosCompletos = [];

    times.forEach(time => {
        time._doc.n_jogos = time._doc.n_vitorias + time._doc.n_empates + time._doc.n_derrotas;
        time._doc.saldo_gols = time._doc.gols_pro - time._doc.gols_contra;
        time._doc.aproveitamento = time._doc.n_jogos > 0 ? 100 : 0;
        timesComDadosCompletos.push(time)
    });

    return timesComDadosCompletos;
};

exports.obterRodadas = async (campeonatoId) => {
    return await Rodada.find({campeonato: campeonatoId}).select('-_id').select('-campeonato').sort('numero')
        .populate({ path: 'partidas', select: '-_id' })
        .exec();
};

exports.obterPartidas = async (rodadaId) => {
    const rodada = await Rodada.findById(rodadaId)
        .populate({ path: 'partidas' })
        .exec();
    return rodada.partidas;
};

exports.obterCampeonatos = async () => {
    return await Campeonato.find({});
};

exports.obterCampeonato = async (campeonatoId) => {
    return await Campeonato.findById(campeonatoId).select('-_id');
};
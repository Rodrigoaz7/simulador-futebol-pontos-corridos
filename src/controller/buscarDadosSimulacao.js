const mongoose = require('mongoose');
require('../models/Rodada')
require('../models/Time')
require('../models/Partida')
require('../models/Campeonato')
const Rodada = mongoose.model('Rodada');
const Partida = mongoose.model('Partida');
const Time = mongoose.model('Time');
const Campeonato = mongoose.model('Campeonato');

exports.obterTimes = async (codigoCampeonato) => {
    const campeonato = await Campeonato.findOne({codigo: codigoCampeonato});
    const times = await Time.find({campeonato: campeonato._id}).select('-_id').select('-campeonato').sort('nome');
    let timesComDadosCompletos = [];

    times.forEach(time => {
        time._doc.n_jogos = time._doc.n_vitorias + time._doc.n_empates + time._doc.n_derrotas;
        time._doc.saldo_gols = time._doc.gols_pro - time._doc.gols_contra;
        time._doc.aproveitamento = time._doc.n_jogos > 0 ? 100 : 0;
        timesComDadosCompletos.push(time)
    });

    return timesComDadosCompletos;
};

exports.obterRodadas = async (codigoCampeonato) => {
    const campeonato = await Campeonato.findOne({codigo: codigoCampeonato});
    return await Rodada.find({campeonato: campeonato._id}).select('-_id').select('-campeonato').sort('numero')
        .populate({ path: 'partidas', select: '-_id' })
        .exec();
};

exports.obterCampeonato = async (codigoCampeonato) => {
    return await Campeonato.findOne({codigo: codigoCampeonato}).select('-_id');
};
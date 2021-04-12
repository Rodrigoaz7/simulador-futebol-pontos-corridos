const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSchema = new Schema({
    campeonato: {
      type: Schema.Types.ObjectId,
      ref: 'Campeonato'
    },
    nome: String,
    sigla: String, //usada como referencia na collection de partida
    pontuacao:  {
      type: Number,
      default: 0
    },
    n_vitorias: {
      type: Number,
      default: 0
    },
    n_empates: {
      type: Number,
      default: 0
    },
    n_derrotas: {
      type: Number,
      default: 0
    },
    gols_pro: {
      type: Number,
      default: 0
    },
    gols_contra: {
      type: Number,
      default: 0
    }
});

mongoose.model('Time', TimeSchema);
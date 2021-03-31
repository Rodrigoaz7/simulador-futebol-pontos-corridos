const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartidaSchema = new Schema({
  time_casa: String,
  time_visitante: String,
  gols_time_casa: {type: Number, default: null},
  gols_time_visitante: {type: Number, default: null},
  rodada: Number
});

mongoose.model('Partida', PartidaSchema);
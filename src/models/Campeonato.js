const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampeonatoSchema = new Schema({
  nome: String,
  codigo: {
      type: String,
      unique: true
  },
  ano: Number,
  rodada_atual: {
      type: Number,
      default: 1
  }
});

mongoose.model('Campeonato', CampeonatoSchema);
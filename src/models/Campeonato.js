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
  },

  /* Os itens de desempate funcionam dividindo-os entre os hífens. Cada string resultante,
   em ordem, determina os termos de desempate. O padrão é P-NV-SG-GP, ou seja, pontuação,
   depois número de vitórias, depois saldo de gols e, por último, gols pró. */
  itens_desempate: {
    type: String,
    default: "P-NV-SG-GP"
  }
});

mongoose.model('Campeonato', CampeonatoSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RodadaSchema = new Schema({
    numero: Number,
    partidas:[{
        type: Schema.Types.ObjectId,
        ref: 'Partida'
    }],
    campeonato:{
        type: Schema.Types.ObjectId,
        ref: 'Campeonato'
    },
});

mongoose.model('Rodada', RodadaSchema);
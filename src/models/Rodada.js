const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RodadaSchema = new Schema({
    numero: Number,
    partidas:[{
        type: Schema.Types.ObjectId,
        ref: 'Partida'
    }]
});

mongoose.model('Rodada', RodadaSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pokemon = new Schema({
    _id: {type: Number},
    name: {type: String},
    next_evolution: {type: Number, ref: 'pokemons'},
    height: {type: Number},
    weight: {type: Number},
    image: {type: String}
});
module.exports = mongoose.model('pokemons', Pokemon);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPokedex = new Schema({
    account_id: {type: Number, ref: 'accounts'},
    pokemon_id: {type: Number, ref: 'pokemons'}
});
module.exports = mongoose.model('userpokedexs', UserPokedex);
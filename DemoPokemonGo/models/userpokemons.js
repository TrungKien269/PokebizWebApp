var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPokemon = new Schema({
    account_id: {type: Number, ref: 'accounts'},
    pokemon_id: {type: Number, ref: 'pokemons'},
    caught_time: {type: String}
});
module.exports = mongoose.model('userpokemons', UserPokemon);
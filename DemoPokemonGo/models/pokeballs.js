var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PokeBall = new Schema({
    _id: {type: Number},
    name: {type: String},
    description: {type: String},
    image: {type: String}
});
module.exports = mongoose.model('pokeballs', PokeBall);
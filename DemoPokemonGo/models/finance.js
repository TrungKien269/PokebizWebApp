var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Finance = new Schema({
    _id: {type: Number, ref: 'accounts'},
    pokecoins: {type: Number}
}, {strict: false});
module.exports = mongoose.model('finances', Finance);
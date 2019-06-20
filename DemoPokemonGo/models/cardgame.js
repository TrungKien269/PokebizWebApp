var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardGame = new Schema({
    _id: {type: String},
    cash: {type: Number},
    status: {type: Number}
});
module.exports = mongoose.model('cardgames', CardGame);
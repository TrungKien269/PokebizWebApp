var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({
    _id: {type: Number},
    account_id: {type: Number},
    datetime: {type: String}
});
module.exports = mongoose.model('transactions', Transaction);
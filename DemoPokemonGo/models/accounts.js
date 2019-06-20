var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    _id: {type: Number},
    username: {type: String},
    password: {type: String},
    nickname: {type: String},
    created_date: {type: String},
    status: {type: Number}
});
module.exports = mongoose.model('accounts', Account);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelAccount = new Schema({
    _id: {type: Number, ref: 'accounts'},
    level: {type: Number},
    exp: {type: Number}
});
module.exports = mongoose.model('levelaccounts', LevelAccount);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Level = new Schema({
    _id: {type: Number},
    exp: {type: Number}
});
module.exports = mongoose.model('levels', Level);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Character = new Schema({
    _id: {type: Number},
    name: {type: String},
    image: {type: String}
});
module.exports = mongoose.model('characters', Character);
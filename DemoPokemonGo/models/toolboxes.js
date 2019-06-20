var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Toolboxes = new Schema({
    _id: {type: Number},
    name: {type: String},
    description: {type: String},
    image: {type: String}
});
module.exports = mongoose.model('toolboxes', Toolboxes);
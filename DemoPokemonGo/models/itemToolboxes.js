var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemToolbox = new Schema({
    _id: {type: Number, ref: 'toolboxes'},
    price: {type: Number}
});
module.exports = mongoose.model('item_toolboxes', ItemToolbox);
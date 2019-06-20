var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemBall = new Schema({
    _id: {type: Number, ref: 'pokeballs'},
    price: {type: Number}
});
module.exports = mongoose.model('item_balls', ItemBall);
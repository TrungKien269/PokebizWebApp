var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserBall = new Schema({
    account_id: {type: Number, ref: 'accounts'},
    ball_id: {type: Number, ref: 'pokeballs'},
    quantity: {type: Number}
});
module.exports = mongoose.model('userballs', UserBall);
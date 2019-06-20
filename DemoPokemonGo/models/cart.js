var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
    account_id: {type: Number},
    item_id: {type: Number},
    type: {type: String}
});
module.exports = mongoose.model('carts', Cart);
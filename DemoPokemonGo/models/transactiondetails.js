var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionDetail = new Schema({
    transaction_id: {type: Number},
    item_id: {type: Number},
    type: {type: String},
    name: {type: String},
    quantity: {type: Number}, 
    price: {type: Number}
});
module.exports = mongoose.model('transactiondetails', TransactionDetail);
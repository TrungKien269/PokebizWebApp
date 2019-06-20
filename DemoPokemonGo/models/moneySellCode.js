var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MoneySellCode = new Schema({
    account_id: {type: Number},
    cash: {type: Number},
    datetime: {type: String}
});
module.exports = mongoose.model('money_sellcodes', MoneySellCode);
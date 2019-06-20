var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    _id: {type: Number},
    fullname: {type: String},
    age: {type: Number},
    sex: {type: String},
    email: {type: String},
    account_id: {type: Number, ref: 'accounts'}
});
module.exports = mongoose.model('users', User);
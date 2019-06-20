var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Avatar = new Schema({
    account_id: {type: Number, ref: 'accounts'},
    character_id: {type: Number, ref: 'characters'},
    changing_time: {type: String}
});
module.exports = mongoose.model('avatars', Avatar);
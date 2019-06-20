var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserToolbox = new Schema({
    account_id: {type: Number, ref: 'accounts'},
    toolbox_id: {type: Number, ref: 'toolboxes'},
    quantity: {type: Number}
});
module.exports = mongoose.model('usertoolboxes', UserToolbox);
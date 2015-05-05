var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 var RowSchema = new Schema({
 	field: {type: String},
    value: {type: String}
 });
 module.exports = mongoose.model('Row', RowSchema);
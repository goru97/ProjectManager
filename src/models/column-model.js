var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 var ColumnSchema = new Schema({
 	field: {type: String},
    displayName: {type: String},
    enableCellEdit:{type: Boolean},
    width: {type: String}
 });
 module.exports = mongoose.model('Column', ColumnSchema);
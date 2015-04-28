var mongoose = require("mongoose");
 Schema = mongoose.Schema;

var ResourceSchema = new Schema({
	project_id: {type: String, required:true},
    name: {type: String},
    email: {type: String},
    type: { type: Date},
    cost: { type: Date},
    fields: [{name:{type:String}, value:{type:String}}]
});



module.exports = mongoose.model('Resource', ResourceSchema);
var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 require('./task-model');


var ProjectSchema = new Schema({
    project_id: {type: String, required:true},
    project_name: {type: String, required:true},
    project_type: {type: String}
   // tasks: [{ type: Schema.Types.ObjectId, ref: mongoose.model('Task').schema}]
});


module.exports = mongoose.model('Project', ProjectSchema);
var mongoose = require("mongoose");
 Schema = mongoose.Schema;
//require('./user-model');
//require('./task-model');


var ProjectSchema = new Schema({
	//username: {type: String, required:true, ref: mongoose.model('User').schema},
    project_id: {type: String, required:true},
    project_name: {type: String, required:true},
    project_type: {type: String},
   // tasks: [mongoose.model('Task').schema]
});


module.exports = mongoose.model('Project', ProjectSchema);
var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 require('./task-model');
 require('./resource-model');


var ProjectSchema = new Schema({
    project_id: {type: String, required:true},
    project_name: {type: String, required:true},
    project_type: {type: String},
    projectProgress: {type: String},
    tasks: [mongoose.model('Task').schema],
    resources: [mongoose.model('Resource').schema]
});


module.exports = mongoose.model('Project', ProjectSchema);
var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 require('./task-model');
 require('./resource-model');
 require('./column-model');
 require('./sprint-model');


var ProjectSchema = new Schema({
    project_id: {type: String, required:true},
    project_name: {type: String, required:true},
    project_type: {type: String},
    projectProgress: {type: String},
    sprints: [mongoose.model('Sprint').schema],
    tasks: [mongoose.model('Task').schema],
    resources: [mongoose.model('Resource').schema],
    extendedFields: [mongoose.model('Column').schema],
});


module.exports = mongoose.model('Project', ProjectSchema);
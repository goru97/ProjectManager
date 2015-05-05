var mongoose = require("mongoose");
 Schema = mongoose.Schema;
 require('./task-model');
 require('./resource-model');
 require('./column-model');


var ProjectSchema = new Schema({
    project_id: {type: String, required:true},
    project_name: {type: String, required:true},
    project_type: {type: String},
    projectProgress: {type: String},
    extendedFields: [mongoose.model('Column').schema],
    tasks: [mongoose.model('Task').schema],
    resources: [mongoose.model('Resource').schema]
});


module.exports = mongoose.model('Project', ProjectSchema);
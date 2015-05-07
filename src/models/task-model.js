var mongoose = require("mongoose");
 Schema = mongoose.Schema,
 require('./resource-model');
  require('./row-model');

var TaskSchema = new Schema({
    project_id: {type: String, required:true},
    task_id: {type: String, required:true},
    name: {type: String,unique:true},
    desc: {type: String}, // Use for initial estimate in case of scrum
    type: {type: String}, //Use for kanban type
    duration: {type: String},
    start: { type: Date},
    end: { type: Date},
    progress: {type: String}, //Use it as status for kan ban
    resources: [String], //Use single resource as assignee for kan ban
    extendedRows: [mongoose.model('Row').schema] //For extended fields

});


module.exports = mongoose.model('Task', TaskSchema);
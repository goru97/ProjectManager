var mongoose = require("mongoose");
 Schema = mongoose.Schema,
 require('./resource-model');

var TaskSchema = new Schema({
    project_id: {type: String, required:true},
    task_id: {type: String, required:true},
    name: {type: String,unique:true},
    duration: {type: String},
    start: { type: Date},
    end: { type: Date},
    resources: [String]
});


module.exports = mongoose.model('Task', TaskSchema);
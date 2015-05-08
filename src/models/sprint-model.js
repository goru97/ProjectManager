var mongoose = require("mongoose");
 Schema = mongoose.Schema,
 require('./task-model');

var SprintSchema = new Schema({
    project_id: {type: String, required:true},
    sprint_id: {type: String, required:true},
    name: {type: String},
    duration: {type: String},
    start: { type: Date},
    end: { type: Date},
    tasks: [mongoose.model('Task').schema]

});


module.exports = mongoose.model('Sprint', SprintSchema);
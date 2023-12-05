const { Schema, model } = require('mongoose');
const Task = require('./Task');
const TaskList = new Schema({
  title: { type: String, required: true },
  toggleCircle: { type: Boolean, required: true },
  isTasklistVisible: { type: Boolean, required: true },
  tasks: [{ type: Object }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  owner: { type: String, required: true },
});
module.exports = model('TaskList', TaskList);

const { Schema, model } = require('mongoose');

const validTypes = ['Personal', 'Working', 'Optional'];
const validStatus = ['Done', 'In Progress'];
const Task = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: validTypes, required: true }, //enum
  text: { type: String },
  status: { type: String, enum: validStatus, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  owner: { type: String, required: true },
});
module.exports = model('Task', Task);

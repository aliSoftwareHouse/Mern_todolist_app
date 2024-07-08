// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  key: String,
  value: String,
});

module.exports = mongoose.model('Task', taskSchema);

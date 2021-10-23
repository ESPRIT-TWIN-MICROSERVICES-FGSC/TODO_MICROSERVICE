const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  due: {
    type: Date,
    default: Date.now,
  },
  done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Todo = mongoose.model("todo", TodoSchema);

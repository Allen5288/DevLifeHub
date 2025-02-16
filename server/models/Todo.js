const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  important: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Add an index to optimize queries by order
todoSchema.index({ project: 1, order: 1 });

module.exports = mongoose.model('Todo', todoSchema);

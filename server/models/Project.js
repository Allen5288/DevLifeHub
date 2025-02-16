const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
  },
  color: {
    type: String,
    default: '#2196F3',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Add index for better query performance
projectSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Project', projectSchema);

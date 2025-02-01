const mongoose = require('mongoose');

const fullstackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  technologies: [{
    type: String,
    required: [true, 'Please specify technologies used']
  }],
  githubUrl: {
    type: String,
    required: [true, 'Please provide GitHub URL']
  },
  demoUrl: {
    type: String
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Please specify the category'],
    enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fullstack', fullstackSchema); 
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Travel', 'Food']
  },
  author: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogPost', blogPostSchema); 
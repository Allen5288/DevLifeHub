const mongoose = require('mongoose');

// Content schema for both big events and local guide tips
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    enum: ['markdown', 'link'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for countries and their content
const glbGuideSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    trim: true
  },
  bigEvents: [contentSchema],
  localGuides: [contentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GlbGuide', glbGuideSchema);
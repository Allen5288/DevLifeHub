const mongoose = require('mongoose')

const loveDiarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, // Store compressed image URL
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('LoveDiary', loveDiarySchema)
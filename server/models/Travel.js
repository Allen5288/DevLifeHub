const mongoose = require('mongoose')

const travelSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: [true, 'Please provide a destination name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    images: [
      {
        type: String,
        required: [true, 'Please provide at least one image URL'],
      },
    ],
    duration: {
      type: Number,
      required: [true, 'Please specify the duration in days'],
    },
    cost: {
      type: Number,
      required: [true, 'Please provide estimated cost'],
    },
    highlights: [
      {
        type: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Travel', travelSchema)

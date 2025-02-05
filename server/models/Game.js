const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    players: {
      min: Number,
      max: Number,
    },
    duration: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Game', gameSchema)

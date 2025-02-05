const mongoose = require('mongoose')

const classSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    students: {
      type: String,
      required: [true, 'Please provide students'],
      trim: true,
    },
    start: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    end: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Please provide hourly rate'],
      default: 50,
    },
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

module.exports = mongoose.model('Class', classSchema)

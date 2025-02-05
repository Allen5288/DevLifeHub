const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a food name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    cuisine: {
      type: String,
      required: [true, 'Please specify the cuisine type'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    ingredients: [
      {
        type: String,
        required: [true, 'Please list ingredients'],
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

module.exports = mongoose.model('Food', foodSchema)

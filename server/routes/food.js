const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');
const { logger } = require('../middleware/logger');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    logger.error('Error fetching foods:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    logger.error('Error fetching food:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new food (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const food = new Food({
      ...req.body,
      userId: req.user._id
    });
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    logger.error('Error creating food:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update food (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    logger.error('Error updating food:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete food (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.json({ success: true, message: 'Food deleted' });
  } catch (error) {
    logger.error('Error deleting food:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 
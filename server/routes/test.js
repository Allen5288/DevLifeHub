const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Create test data
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const test = new Test({ message });
    await test.save();
    res.status(201).json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all test data
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find().sort({ timestamp: -1 });
    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 
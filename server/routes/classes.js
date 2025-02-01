const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const { logger } = require('../middleware/logger');

// Get all classes for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find({ userId: req.user._id });
    
    // Convert dates to ISO strings manually
    const formattedClasses = classes.map(cls => ({
      ...cls.toObject(),
      id: cls._id,
      start: cls.start.toISOString(),
      end: cls.end.toISOString()
    }));

    res.json(formattedClasses);
  } catch (error) {
    logger.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a new class
router.post('/', auth, async (req, res) => {
  try {
    const { subject, students, start, end, hourlyRate } = req.body;
    
    if (!subject || !students || !start || !end || !hourlyRate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Parse dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const newClass = new Class({
      subject,
      students,
      start: startDate,
      end: endDate,
      hourlyRate: Number(hourlyRate),
      userId: req.user._id
    });

    const savedClass = await newClass.save();
    
    // Convert dates to ISO strings manually
    const formattedClass = {
      ...savedClass.toObject(),
      id: savedClass._id,
      start: savedClass.start.toISOString(),
      end: savedClass.end.toISOString()
    };

    res.status(201).json(formattedClass);
  } catch (error) {
    logger.error('Error creating class:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update a class
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a class
router.delete('/:id', auth, async (req, res) => {
  try {
    await Class.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
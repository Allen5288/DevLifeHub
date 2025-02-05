const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Travel = require('../models/Travel')
const { logger } = require('../middleware/logger')

// Get all travel destinations
router.get('/', async (req, res) => {
  try {
    const travels = await Travel.find()
    res.json(travels)
  } catch (error) {
    logger.error('Error fetching travels:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get travel by ID
router.get('/:id', async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id)
    if (!travel) {
      return res.status(404).json({ success: false, message: 'Travel destination not found' })
    }
    res.json(travel)
  } catch (error) {
    logger.error('Error fetching travel:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create new travel destination (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const travel = new Travel({
      ...req.body,
      userId: req.user._id,
    })
    await travel.save()
    res.status(201).json(travel)
  } catch (error) {
    logger.error('Error creating travel:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update travel destination (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const travel = await Travel.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })
    if (!travel) {
      return res.status(404).json({ success: false, message: 'Travel destination not found' })
    }
    res.json(travel)
  } catch (error) {
    logger.error('Error updating travel:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Delete travel destination (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const travel = await Travel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!travel) {
      return res.status(404).json({ success: false, message: 'Travel destination not found' })
    }
    res.json({ success: true, message: 'Travel destination deleted' })
  } catch (error) {
    logger.error('Error deleting travel:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router

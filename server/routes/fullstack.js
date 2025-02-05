const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Fullstack = require('../models/Fullstack')
const { logger } = require('../middleware/logger')

// Get all fullstack projects
router.get('/', async (req, res) => {
  try {
    const projects = await Fullstack.find()
    res.json(projects)
  } catch (error) {
    logger.error('Error fetching projects:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Fullstack.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    logger.error('Error fetching project:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create new project (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const project = new Fullstack({
      ...req.body,
      userId: req.user._id,
    })
    await project.save()
    res.status(201).json(project)
  } catch (error) {
    logger.error('Error creating project:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update project (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Fullstack.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    logger.error('Error updating project:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Delete project (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Fullstack.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    logger.error('Error deleting project:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router

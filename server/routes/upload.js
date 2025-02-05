const express = require('express')
const router = express.Router()
const { upload, uploadToS3 } = require('../utils/fileUpload')
const { protect, authorize } = require('../middleware/auth')
const { logger } = require('../middleware/logger')

// Upload single image
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' })
    }

    const imageUrl = await uploadToS3(req.file, 'images')
    res.json({ imageUrl })
  } catch (error) {
    logger.error('Upload Error:', error)
    res.status(500).json({ message: 'Error uploading file' })
  }
})

// Upload multiple images
router.post('/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: 'Please upload files' })
    }

    const uploadPromises = req.files.map(file => uploadToS3(file, 'images'))
    const imageUrls = await Promise.all(uploadPromises)

    res.json({ imageUrls })
  } catch (error) {
    logger.error('Upload Error:', error)
    res.status(500).json({ message: 'Error uploading files' })
  }
})

module.exports = router

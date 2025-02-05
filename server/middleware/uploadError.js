const { logger } = require('./logger')

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error('Multer Error:', error)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB',
      })
    }
    return res.status(400).json({
      message: 'File upload error',
    })
  }

  if (error.message === 'Not an image! Please upload only images.') {
    return res.status(400).json({
      message: error.message,
    })
  }

  next(error)
}

module.exports = handleUploadError

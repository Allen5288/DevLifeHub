const multer = require('multer')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const { logger } = require('../middleware/logger')

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

// Configure Multer
const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Not an image! Please upload only images.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

const uploadToS3 = async (file, folder = 'general') => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${folder}/${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    logger.error('S3 Upload Error:', error)
    throw new Error('Error uploading file')
  }
}

module.exports = { upload, uploadToS3 }

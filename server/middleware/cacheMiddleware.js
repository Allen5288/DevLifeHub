const cache = require('../utils/cache')
const { logger } = require('./logger')

const cacheMiddleware = duration => async (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next()
  }

  // Use _id to match MongoDB's id format
  const key = `${req.user._id}-${req.originalUrl}`

  try {
    const cachedData = await cache.get(key)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }

    // Modify res.json to cache the response
    const originalJson = res.json
    res.json = function (data) {
      cache.set(key, JSON.stringify(data), duration)
      return originalJson.call(this, data)
    }

    next()
  } catch (error) {
    logger.error('Cache Middleware Error:', error)
    next()
  }
}

module.exports = cacheMiddleware

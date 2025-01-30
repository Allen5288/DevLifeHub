const Redis = require('ioredis');
const { logger } = require('../middleware/logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  logger.error('Redis Error:', err);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

const DEFAULT_EXPIRATION = 3600; // 1 hour

const cache = {
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis Get Error:', error);
      return null;
    }
  },

  async set(key, value, expiration = DEFAULT_EXPIRATION) {
    try {
      await redis.setex(key, expiration, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis Set Error:', error);
    }
  },

  async del(key) {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Redis Delete Error:', error);
    }
  }
};

module.exports = cache; 
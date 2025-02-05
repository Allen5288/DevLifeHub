const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const securityMiddleware = [
  // Set security HTTP headers
  helmet(),

  // Sanitize data against NoSQL query injection
  mongoSanitize(),

  // Prevent XSS attacks
  xss(),

  // Prevent parameter pollution
  hpp({
    whitelist: ['category', 'sort'], // Allow duplicate parameters for these
  }),
]

module.exports = securityMiddleware

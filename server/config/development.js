// Only apply these settings in development
if (process.env.NODE_ENV === 'development') {
  // Disable SSL verification
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  require('https').globalAgent.options.rejectUnauthorized = false

  console.warn('\x1b[33m%s\x1b[0m', '⚠️  Warning: SSL verification is disabled in development mode')
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  Do not use these settings in production!')
}

module.exports = {
  // Add any other development-specific configurations here
  sslVerification: false,
}

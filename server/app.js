const express = require('express')
const errorHandler = require('./middleware/error')

const app = express()

// ... other middleware and routes ...

// Error handling middleware (should be last)
app.use(errorHandler)

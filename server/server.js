const dotenv = require('dotenv')
// 根据环境加载不同的 .env 文件
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
} else {
  dotenv.config({ path: '.env.development' })
  require('./config/development')
}

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const contactRoutes = require('./routes/contact')
const classesRoutes = require('./routes/classes')
const testRoutes = require('./routes/test')
const menuRoutes = require('./routes/menu')
const gamesRoutes = require('./routes/games')
const blogRoutes = require('./routes/blog')
const travelRoutes = require('./routes/travel')
const foodRoutes = require('./routes/food')
const fullstackRoutes = require('./routes/fullstack')
const todoRoutes = require('./routes/todoRoutes')
const loveDiaryRoutes = require('./routes/loveDiary')
const glbGuidesRoutes = require('./routes/glbGuides')

// Import middleware
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Trust proxy - Add this before other middleware
app.set('trust proxy', 1)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // Add trusted proxy configuration
  trustProxy: true,
})

// Security middleware
app.use(helmet())

app
.use(cors());
// Apply rate limiting to all requests
app.use(limiter)

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    // Add proxy trust for sessions
    proxy: true,
  })
)

// Initialize Passport and restore authentication state from session
app.use(passport.initialize())

// Import and initialize Passport configuration
require('./config/passport')

// Add this near the top of the file, after the require statements
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  require('https').globalAgent.options.rejectUnauthorized = false
  console.warn('⚠️  SSL verification disabled in development mode')
}

// Add a root route handler
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevLifeHub API',
    status: 'Server is running',
    documentation: '/api-docs', // if you plan to add API documentation
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      contact: '/api/contact',
      classes: '/api/classes',
      test: '/api/test',
      menu: '/api/menu',
      games: '/api/games',
      blog: '/api/blog',
      travel: '/api/travel',
      food: '/api/food',
      fullstack: '/api/fullstack',
      glbguides: '/api/glbguides',
    },
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/classes', classesRoutes)
app.use('/api/test', testRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/games', gamesRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/travel', travelRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/fullstack', fullstackRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/love-diary', loveDiaryRoutes)
app.use('/api/glbguides', glbGuidesRoutes)

// Error handling middleware
app.use(errorHandler)

// Add a catch-all route handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  })
})

const PORT = process.env.PORT || 5001

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app

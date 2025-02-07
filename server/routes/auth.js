const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const router = express.Router()
const authController = require('../controllers/authController')
const { validate, registerRules } = require('../middleware/validate')
const { logger } = require('../middleware/logger')
const auth = require('../middleware/auth')

// Auth routes
router.post('/register', validate(registerRules), authController.register)


// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password')

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Check if password exists
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Account exists but no password set (Google login user)',
      })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d', // Provide a default if not set
    })

    // Remove password from response
    user.password = undefined

    // Set cookie with proper expiration calculation
    const cookieExpire = process.env.JWT_COOKIE_EXPIRE || 30 // days
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    // Send response
    res.status(200).json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
})

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account',
    accessType: 'offline',
    timeout: 30000,
  })(req, res, next)
})

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', (req, res, next) => {
  passport.authenticate(
    'google',
    {
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
      session: false,
      timeout: 30000,
    },
    (err, user) => {
      if (err) {
        logger.error('Google Auth Error:', err)
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`)
      }

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`)
      }

      try {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE || '30d',
        })

        // Set JWT cookie
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        })

        // Also set a non-httpOnly cookie for client-side auth state
        res.cookie('isAuthenticated', 'true', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        })

        res.redirect(`${process.env.CLIENT_URL}/tools`)
      } catch (error) {
        logger.error('Token generation error:', error)
        res.redirect(`${process.env.CLIENT_URL}/login?error=token_error`)
      }
    }
  )(req, res, next)
})

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.json({ success: true, message: 'Logged out successfully' })
})

// @route   GET /api/auth/check
// @desc    Check auth status
// @access  Private
router.get('/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    logger.error('Auth check error:', error)
    res.status(500).json({
      success: false,
      message: 'Error checking auth status',
    })
  }
})

// Forgot password routes
router.post('/forgot-password', authController.forgotPassword)
router.post('/verify-security-answer', authController.verifySecurityAnswer)
router.post('/reset-password', authController.resetPassword)

module.exports = router

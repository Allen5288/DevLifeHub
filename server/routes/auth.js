const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginRules, registerRules } = require('../validation/authValidation');
const { logger } = require('../middleware/logger');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', validate(registerRules), authController.register);

// Validation middleware
const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set JWT as HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', 
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      prompt: 'select_account',
      accessType: 'offline',
      timeout: 30000
    })(req, res, next);
  }
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
      session: false,
      timeout: 30000
    }, (err, user) => {
      if (err) {
        logger.error('Google Auth Error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`);
      }
      
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      try {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set JWT cookie
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Also set a non-httpOnly cookie for client-side auth state
        res.cookie('isAuthenticated', 'true', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/tools`);
      } catch (error) {
        logger.error('Token generation error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=token_error`);
      }
    })(req, res, next);
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true, message: 'Logged out successfully' });
});

// @route   GET /api/auth/check
// @desc    Check auth status
// @access  Private
router.get('/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking auth status'
    });
  }
});

module.exports = router; 
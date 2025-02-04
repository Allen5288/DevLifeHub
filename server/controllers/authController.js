const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logger } = require('../middleware/logger');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password, securityQuestion, securityAnswer } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        role: 'user',
        securityQuestion: {
          question: securityQuestion,
          answer: securityAnswer
        }
      });

      // Save user to database
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Set cookies
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.cookie('isAuthenticated', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      // Send response
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error registering user'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      logger.info(`Login attempt for email: ${email}`);

      // Validate input
      if (!email || !password) {
        logger.warn('Login attempt without email or password');
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      // Find user and explicitly select password field
      const user = await User.findOne({ email }).select('+password');
      logger.info(`User found: ${user ? 'yes' : 'no'}`);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password match
      const isMatch = await user.matchPassword(password);
      logger.info(`Password match: ${isMatch ? 'yes' : 'no'}`);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Clear any existing cookies
      res.clearCookie('jwt');
      res.clearCookie('isAuthenticated');

      // Set new cookies
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.cookie('isAuthenticated', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      // Remove sensitive data before sending response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };

      logger.info(`Login successful for user: ${user._id}`);
      res.json({
        success: true,
        user: userResponse
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during login'
      });
    }
  },

  // Logout user
  logout: (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('isAuthenticated');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  },

  // Google OAuth login
  googleAuth: passport.authenticate('google', {
    scope: ['profile', 'email']
  }),

  // Google OAuth callback
  googleCallback: (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: '/login'
    }, (err, user) => {
      if (err) {
        return next(err);
      }
      
      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    })(req, res, next);
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select('+securityQuestion.question');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No user found with that email'
        });
      }

      res.json({
        success: true,
        securityQuestion: user.securityQuestion.question
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing request'
      });
    }
  },

  verifySecurityAnswer: async (req, res) => {
    try {
      const { email, answer } = req.body;
      const user = await User.findOne({ email }).select('+securityQuestion.answer');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isMatch = await bcrypt.compare(answer, user.securityQuestion.answer);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect security answer'
        });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Security answer verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying security answer'
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.password = password;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      logger.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Error resetting password'
      });
    }
  }
};

module.exports = authController; 
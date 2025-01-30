const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logger } = require('../middleware/logger');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error in registration',
        error: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error in login',
        error: error.message
      });
    }
  },

  // Logout user
  logout: (req, res) => {
    req.logout();
    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
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
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: 'No user with that email' });
      }

      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      await sendPasswordResetEmail(user.email, resetToken);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error('Forgot Password Error:', error);
      res.status(500).json({ message: 'Error sending reset email' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      res.json({ token });
    } catch (error) {
      logger.error('Reset Password Error:', error);
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = authController; 
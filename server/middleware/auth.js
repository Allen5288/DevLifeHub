const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('./logger');

const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      logger.warn('No token found in cookies');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        logger.warn(`User not found for token userId: ${decoded.userId}`);
        throw new Error('User not found');
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.clearCookie('jwt');
      res.clearCookie('isAuthenticated');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'User role not authorized to access this route' 
      });
    }
    next();
  };
};

module.exports = auth; 
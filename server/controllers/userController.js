const User = require('../models/User');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching profile',
        error: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  },

  // Delete user profile
  deleteProfile: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.json({
        success: true,
        message: 'User account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting profile',
        error: error.message
      });
    }
  }
};

module.exports = userController; 
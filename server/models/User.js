const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { logger } = require('../middleware/logger');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  securityQuestion: {
    question: {
      type: String,
      required: [true, 'Please select a security question'],
      enum: [
        'What was the name of your first pet?',
        'In which city were you born?',
        'What was your mother\'s maiden name?',
        'What was the name of your primary school?',
        'What was the make of your first car?',
        'What is your favorite book?',
        'What is the name of the street you grew up on?',
        'What was your childhood nickname?',
        'What is your favorite movie?',
        'Who was your childhood best friend?'
      ]
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer to the security question'],
      select: false // Hide answer by default
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add this pre-save middleware after the existing password hashing middleware
userSchema.pre('save', async function(next) {
  // Only hash the security answer if it's been modified (or is new)
  if (!this.isModified('securityQuestion.answer')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.securityQuestion.answer = await bcrypt.hash(this.securityQuestion.answer, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    if (!this.password) {
      throw new Error('Password not found for user');
    }
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema); 
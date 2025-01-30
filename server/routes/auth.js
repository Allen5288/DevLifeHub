const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginRules, registerRules } = require('../validation/authValidation');

// Auth routes
router.post('/register', validate(registerRules), authController.register);
router.post('/login', validate(loginRules), authController.login);
router.post('/logout', authController.logout);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

module.exports = router; 
const { body } = require('express-validator')

const loginRules = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('securityQuestion').notEmpty().withMessage('Please select a security question'),
  body('securityAnswer')
    .trim()
    .notEmpty()
    .withMessage('Please provide an answer to the security question')
    .isLength({ min: 2 })
    .withMessage('Security answer must be at least 2 characters long'),
]

module.exports = {
  loginRules,
  registerRules,
}

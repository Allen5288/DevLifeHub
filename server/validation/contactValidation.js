const { body } = require('express-validator')

const contactRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('subject').trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters long'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
]

module.exports = {
  contactRules,
}

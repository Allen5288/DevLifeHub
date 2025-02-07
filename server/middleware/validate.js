const { validationResult, body } = require('express-validator')

// Middleware to validate request
const validate = validations => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)))

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    next()
  }
}

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

const contactRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('subject').trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters long'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
]

module.exports = {
  validate,
  registerRules,
  contactRules,
}

exports.cocktailRules = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('ingredients').isArray().withMessage('Ingredients must be an array'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('category').notEmpty().trim().withMessage('Category is required'),
]

exports.orderRules = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.cocktailId').isMongoId().withMessage('Invalid cocktail ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customerName').notEmpty().trim().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
]

exports.blogPostRules = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('content').notEmpty().trim().withMessage('Content is required'),
  body('category').isIn(['Travel', 'Food']).withMessage('Invalid category'),
  body('author').notEmpty().trim().withMessage('Author is required'),
]

exports.commentRules = [
  body('author').notEmpty().trim().withMessage('Author name is required'),
  body('content').notEmpty().trim().withMessage('Comment content is required'),
]

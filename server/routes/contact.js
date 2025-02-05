const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')
const validate = require('../middleware/validate')
const { contactRules } = require('../validation/contactValidation')

router.post('/', validate(contactRules), contactController.sendMessage)

module.exports = router

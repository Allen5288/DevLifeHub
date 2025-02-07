const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')
const { validate, contactRules } = require('../middleware/validate')

router.post('/', validate(contactRules), contactController.sendMessage)

module.exports = router

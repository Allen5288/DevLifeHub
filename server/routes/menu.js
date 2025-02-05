const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menuController')

// Get all cocktails
router.get('/cocktails', menuController.getAllCocktails)

// Create new order
router.post('/orders', menuController.createOrder)

// Get orders
router.get('/orders', menuController.getOrders)

module.exports = router

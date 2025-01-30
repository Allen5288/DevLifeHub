const Cocktail = require('../models/Cocktail');
const Order = require('../models/Order');

exports.getAllCocktails = async (req, res) => {
  try {
    const cocktails = await Cocktail.find();
    res.json(cocktails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.cocktailId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
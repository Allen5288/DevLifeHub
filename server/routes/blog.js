const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Get all blog posts
router.get('/', blogController.getAllPosts);

// Get blog post by ID
router.get('/:id', blogController.getPostById);

// Create new blog post
router.post('/', blogController.createPost);

// Add comment to blog post
router.post('/:id/comments', blogController.addComment);

module.exports = router; 
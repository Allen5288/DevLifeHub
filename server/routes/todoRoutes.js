const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const {
  createProject,
  getProjects,
  deleteProject,
  createTodo,
  getTodosByProject,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

// Specific rate limiter for todo routes
const todoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests from this IP, please try again later' }
});

// Project routes with rate limiting
router.post('/projects', auth, createProject);
router.get('/projects', auth, cacheMiddleware(300), getProjects);
router.delete('/projects/:projectId', auth, deleteProject);

// Todo routes with rate limiting
router.post('/', auth, createTodo);
router.get('/project/:projectId', auth, cacheMiddleware(300), getTodosByProject);
router.patch('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const {
  createProject,
  getProjects,
  deleteProject,
  createTodo,
  getTodosByProject,
  updateTodo,
  deleteTodo,
  updateTodoOrder,
  updateProject
} = require('../controllers/todoController');

// Project routes
router.post('/projects', auth, createProject);
router.get('/projects', auth, cacheMiddleware(300), getProjects);
router.patch('/projects/:projectId', auth, updateProject);
router.delete('/projects/:projectId', auth, deleteProject);

// Todo routes
router.post('/', auth, createTodo);
router.get('/project/:projectId', auth, cacheMiddleware(300), getTodosByProject);
router.patch('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);
router.put('/order', auth, updateTodoOrder);

module.exports = router;

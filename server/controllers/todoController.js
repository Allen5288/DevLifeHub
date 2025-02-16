const Todo = require('../models/Todo');
const Project = require('../models/Project');
const cache = require('../utils/cache');

function invalidateUserCache(userId) {
  // Clear all cached data for this user
  cache.del(`${userId}-/api/todos/projects`);
  cache.keys(`${userId}-/api/todos/project/*`).forEach(key => cache.del(key));
}

// Project Controllers
const createProject = async (req, res) => {
  try {
    const { name, description, category, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const existingProject = await Project.findOne({ 
      name: name, 
      user: req.user.id 
    });
    
    if (existingProject) {
      return res.status(400).json({ message: 'Project with this name already exists' });
    }

    const project = await Project.create({
      name,
      description,
      category,
      color,
      user: req.user.id
    });
    
    invalidateUserCache(req.user.id);
    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ 
      message: 'Server error while creating project',
      details: error.message 
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const session = await Project.startSession();
    await session.withTransaction(async () => {
      const project = await Project.findOneAndDelete({ 
        _id: req.params.projectId,
        user: req.user.id 
      }).session(session);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      await Todo.deleteMany({ 
        project: req.params.projectId,
        user: req.user.id 
      }).session(session);
    });
    
    invalidateUserCache(req.user.id);
    session.endSession();
    res.json({ message: 'Project and associated todos deleted successfully' });
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while deleting project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, category, color } = req.body;

    // Check for duplicate project name
    const existingProject = await Project.findOne({
      name,
      user: req.user.id,
      _id: { $ne: req.params.projectId }
    });

    if (existingProject) {
      return res.status(400).json({ message: 'Project with this name already exists' });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.projectId, user: req.user.id },
      { name, description, category, color },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    invalidateUserCache(req.user.id);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating project' });
  }
};

// Todo Controllers
const createTodo = async (req, res) => {
  try {
    if (!req.body.text || !req.body.projectId) {
      return res.status(400).json({ message: 'Todo text and project ID are required' });
    }

    const project = await Project.findOne({ 
      _id: req.body.projectId, 
      user: req.user.id 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const todo = await Todo.create({
      text: req.body.text,
      project: req.body.projectId,
      user: req.user.id
    });
    
    invalidateUserCache(req.user.id);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating todo' });
  }
};

const getTodosByProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.projectId, 
      user: req.user.id 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const todos = await Todo.find({
      project: req.params.projectId,
      user: req.user.id
    }).sort({ important: -1, completed: 1, createdAt: -1 }); // Important todos first, then incomplete, then by creation date
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const allowedUpdates = ['completed', 'important', 'text', 'order'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update fields' });
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    invalidateUserCache(req.user.id);
    res.json(todo);
  } catch (error) {
    console.error('Todo update error:', error);
    res.status(500).json({ 
      message: 'Server error while updating todo',
      details: error.message 
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    invalidateUserCache(req.user.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
};

const updateTodoOrder = async (req, res) => {
  try {
    const { todos } = req.body;
    
    // Update each todo's position in parallel
    await Promise.all(todos.map(async (todo, index) => {
      await Todo.findOneAndUpdate(
        { _id: todo._id, user: req.user._id },
        { $set: { order: index } },
        { new: true }
      );
    }));
    
    res.json({ message: 'Todo order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating todo order' });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
  createTodo,
  getTodosByProject,
  updateTodo,
  deleteTodo,
  updateTodoOrder,
  updateProject
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Typography,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidth,
}));

const TodoItem = styled(Paper)(({ theme, completed }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: completed ? 'rgba(0, 0, 0, 0.04)' : 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
}));

function TodoApp() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ projects: false, todos: false });

  // Fetch projects with loading state
  const fetchProjects = useCallback(async () => {
    setLoading(prev => ({ ...prev, projects: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  }, [selectedProject]);

  // Fetch todos with loading state
  const fetchTodos = useCallback(async () => {
    if (!selectedProject) return;
    setLoading(prev => ({ ...prev, todos: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/project/${selectedProject._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(prev => ({ ...prev, todos: false }));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      fetchTodos();
    }
  }, [selectedProject, fetchTodos]);

  const handleAddProject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const project = await response.json();
      setProjects([...projects, project]);
      setNewProjectName('');
      setSelectedProject(project);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  // Add todo with optimistic update
  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;
    
    const optimisticTodo = {
      _id: Date.now().toString(), // temporary ID
      text: newTodoText,
      completed: false,
      project: selectedProject._id
    };

    setTodos(prev => [optimisticTodo, ...prev]);
    setNewTodoText('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: optimisticTodo.text,
          projectId: selectedProject._id,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create todo');
      }

      const actualTodo = await response.json();
      setTodos(prev => prev.map(t => 
        t._id === optimisticTodo._id ? actualTodo : t
      ));
    } catch (err) {
      setTodos(prev => prev.filter(t => t._id !== optimisticTodo._id));
      setError(err.message);
    }
  };

  // Optimistic update for todo toggle
  const handleToggleTodo = async (todoId) => {
    const originalTodos = [...todos];
    const todoIndex = todos.findIndex(t => t._id === todoId);
    const updatedTodo = { ...todos[todoIndex], completed: !todos[todoIndex].completed };
    
    // Optimistic update
    setTodos(todos.map(t => t._id === todoId ? updatedTodo : t));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update todo');
      }
    } catch (err) {
      // Revert on failure
      setTodos(originalTodos);
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure? This will delete all todos in this project.')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete project');
        setProjects(projects.filter(p => p._id !== projectId));
        if (selectedProject._id === projectId) {
          setSelectedProject(projects[0]);
        }
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Projects</Typography>
          {loading.projects ? (
            <Typography>Loading projects...</Typography>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New Project Name"
                  sx={{ mb: 1 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddProject}
                  disabled={!newProjectName}
                >
                  Add Project
                </Button>
              </Box>
              <List>
                {projects.map((project) => (
                  <ListItem
                    key={project._id}
                    button
                    selected={selectedProject?._id === project._id}
                    onClick={() => setSelectedProject(project)}
                  >
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary={project.name} />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </Drawer>
      <Main>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {selectedProject && (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>{selectedProject.name}</Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="New Todo"
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTodo}
                disabled={!newTodoText}
                sx={{ mt: 1 }}
              >
                Add Todo
              </Button>
            </Box>
            {loading.todos ? (
              <Typography>Loading todos...</Typography>
            ) : (
              <List>
                {todos.map((todo) => (
                  <TodoItem key={todo._id} completed={todo.completed}>
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo._id)}
                    />
                    <Typography
                      sx={{
                        flexGrow: 1,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {todo.text}
                    </Typography>
                    <IconButton onClick={() => handleDeleteTodo(todo._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TodoItem>
                ))}
              </List>
            )}
          </>
        )}
      </Main>
    </Box>
  );
}

export default TodoApp;

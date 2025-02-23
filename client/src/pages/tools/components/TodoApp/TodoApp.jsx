import React, { useState, useEffect, useCallback, forwardRef, useRef } from 'react'
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
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Zoom,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Stack,
  Popover,
  ButtonBase,
  ListSubheader,
  Divider,
} from '@mui/material'
import { ChromePicker } from 'react-color'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderIcon,
  Menu as MenuIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material'
import { useAuth } from '../../../../context/AuthContext'
import { styled } from '@mui/material/styles'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const drawerWidth = {
  xs: '100%',
  sm: 280,
}

const Main = styled('main', {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    ...(open && {
      marginLeft: drawerWidth.sm,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const TodoItem = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}))

const TodoContent = styled(Paper)(({ theme, completed, isdragging, isImportant }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.08)' : isImportant ? 'rgba(244, 67, 54, 0.03)' : 'white',
  transition: 'all 0.2s ease',
  border: `1px solid ${
    completed ? theme.palette.success.light : 
    isImportant ? theme.palette.error.light : 
    theme.palette.divider
  }`,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
  '&:hover': {
    backgroundColor: completed ? 'rgba(76, 175, 80, 0.12)' : 
                  isImportant ? 'rgba(244, 67, 54, 0.08)' : 
                  'rgba(0, 0, 0, 0.04)',
    '& .drag-handle': {
      opacity: 1,
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .drag-handle': {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: {
      xs: '24px',
      sm: '32px'
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    transition: 'all 0.2s ease',
    borderRight: `1px solid ${theme.palette.divider}`,
    cursor: isdragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    '&:hover': {
      opacity: 1,
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      cursor: 'grabbing',
      backgroundColor: theme.palette.action.selected,
    },
  },
  '& .todo-content': {
    marginLeft: {
      xs: '24px',
      sm: '32px'
    },
    paddingLeft: {
      xs: '8px',
      sm: '12px'
    },
    width: 'calc(100% - 32px)',
    display: 'flex',
    alignItems: 'center',
    borderLeft: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      '& .MuiTypography-root': {
        fontSize: '0.9rem',
      },
      '& .MuiIconButton-root': {
        padding: 6,
      },
    },
  }
}))

const ProjectItem = ({ project, selected, onClick, onEdit, onDelete, onSelect }) => (
  <ListItem
    button
    selected={selected}
    onClick={(e) => {
      onClick(e);
      onSelect(project);
    }}
    sx={{
      margin: theme => theme.spacing(0.5, 0),
      borderRadius: theme => theme.shape.borderRadius,
      borderLeft: `4px solid ${project.color}`,
      backgroundColor: selected ? theme => theme.palette.primary.light : 'transparent',
      color: selected ? theme => theme.palette.primary.contrastText : 'inherit',
      '&:hover': {
        backgroundColor: selected ? theme => theme.palette.primary.light : theme => theme.palette.action.hover,
      },
    }}
  >
    <ListItemIcon>
      <FolderIcon sx={{ color: project.color }} />
    </ListItemIcon>
    <ListItemText 
      primary={project.name} 
      secondary={
        <Typography variant="body2" component="span" color="text.secondary">
          {project.description}
          <br />
          {project.category}
        </Typography>
      }
    />
    <Box>
      <IconButton size='small' onClick={e => { e.stopPropagation(); onEdit(); }}>
        <EditIcon fontSize='small' />
      </IconButton>
      <IconButton size='small' onClick={e => { e.stopPropagation(); onDelete(); }}>
        <DeleteIcon fontSize='small' />
      </IconButton>
    </Box>
  </ListItem>
);

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}))

const PageTransition = styled(motion.div)({
  width: '100%',
  height: '100%',
})

const MenuButton = styled(IconButton)(({ theme, open }) => ({
  position: 'fixed',
  left: {
    xs: 20,
    sm: open ? drawerWidth.sm - 20 : 20,
  },
  top: theme.spacing(2),
  transition: theme.transitions.create(['left', 'transform'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  zIndex: theme.zIndex.drawer + 2,
  backgroundColor: 'white',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transform: 'scale(1.1)',
  },
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
    background: theme.palette.grey[50],
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}))

const LoadingAnimation = styled(motion.div)({
  width: '100%',
  height: '4px',
  background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
  backgroundSize: '200% 100%',
})

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
}))

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.light,
  },
}))

const TodoCheckbox = ({ completed, onClick, isToggling, isdragging }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 44,
        height: 44,
        marginLeft: -1,
        marginRight: 1,
        opacity: isdragging ? 0.5 : 1,
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1,
          position: 'relative',
          opacity: isToggling ? 0.7 : 1,
          transition: 'opacity 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:focus-visible': {
            outline: theme => `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <Box
          sx={theme => ({
            width: 24,
            height: 24,
            borderRadius: 1,
            marginLeft: 2,
            border: `2px solid ${completed ? theme.palette.success.main : theme.palette.grey[500]}`,
            backgroundColor: completed ? theme.palette.success.main : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: completed ? 'none' : '0 1px 3px rgba(0,0,0,0.12)',
            transform: isToggling ? 'scale(0.9)' : 'scale(1)',
            '&:hover': {
              borderColor: theme.palette.success.main,
              backgroundColor: completed ? theme.palette.success.dark : 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            },
          })}
        >
          <CheckIcon 
            fontSize="small" 
            sx={{ 
              color: 'white',
              opacity: completed ? 1 : 0,
              transform: `scale(${completed ? 1 : 0})`,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: completed ? 'checkmark-pop 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              '@keyframes checkmark-pop': {
                '0%': { transform: 'scale(0)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' },
              },
            }} 
          />
        </Box>
      </ButtonBase>
    </Box>
  );
};

const ImportantFlag = ({ isImportant, onClick, disabled }) => (
  <IconButton
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onClick(e);
      }
    }}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    disabled={disabled}
    size="small"
    sx={theme => ({
      position: 'relative',
      zIndex: 2,
      color: isImportant ? theme.palette.error.main : theme.palette.text.disabled,
      transition: 'all 0.2s ease',
      opacity: isImportant ? 1 : 0.5,
      padding: 1,
      minWidth: '32px',
      minHeight: '32px',
      '&:hover': {
        color: theme.palette.error.main,
        transform: 'scale(1.1)',
        backgroundColor: 'rgba(0,0,0,0.04)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
      '&.Mui-disabled': {
        opacity: 0.3,
      },
      animation: isImportant ? 'pop 0.3s ease' : 'none',
      '@keyframes pop': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.2)' },
        '100%': { transform: 'scale(1)' },
      },
    })}
  >
    {isImportant ? (
      <Tooltip title="Mark as not important" arrow placement="top">
        <PriorityHighIcon 
          fontSize="small"
          sx={{
            animation: 'fade-in 0.3s ease',
            '@keyframes fade-in': {
              '0%': { opacity: 0, transform: 'scale(0.5)' },
              '100%': { opacity: 1, transform: 'scale(1)' },
            },
          }}
        />
      </Tooltip>
    ) : (
      <Tooltip title="Mark as important" arrow placement="top">
        <PriorityHighIcon fontSize="small" />
      </Tooltip>
    )}
  </IconButton>
);

const SortableTodoItem = forwardRef(({ todo, onDelete, onToggle, onToggleImportant }, ref) => {
  const { attributes, listeners, setNodeRef, transform, transition, isdragging } = useSortable({ 
    id: todo._id,
    disabled: false,
    modifiers: [
      {
        name: 'preventOverlap',
        options: {
          tolerance: 5,
        },
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const inputRef = useRef(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isTogglingImportant, setIsTogglingImportant] = useState(false);

  const handleToggle = async (e) => {
    if (isdragging) return;
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    await onToggle(todo._id);
    setIsToggling(false);
  };

  const handleDelete = async (e) => {
    if (isdragging) return;
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    await onDelete(todo._id);
    setIsDeleting(false);
  };

  const handleToggleImportant = async (e) => {
    if (isdragging) return;
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingImportant) return;

    setIsTogglingImportant(true);
    await onToggleImportant(todo._id);
    setIsTogglingImportant(false);
  };

  const handleEdit = async () => {
    if (!editedText.trim() || editedText === todo.text) {
      setIsEditing(false);
      setEditedText(todo.text);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: editedText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      todo.text = editedText.trim();
      setIsEditing(false);
    } catch (err) {
      setEditedText(todo.text);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isdragging ? 0.5 : 1,
  };

  const composedRef = useCallback(
    (node) => {
      setNodeRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, setNodeRef]
  );

  return (
    <TodoItem
      ref={composedRef}
      style={style}
    >
      <TodoContent completed={todo.completed} isdragging={isdragging} isImportant={todo.important}>
        <Box 
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          <DragIcon fontSize="small" />
        </Box>
        <Box className="todo-content">
          <TodoCheckbox
            completed={todo.completed}
            onClick={handleToggle}
            isToggling={isToggling}
            isdragging={isdragging}
          />
          {isEditing ? (
            <TextField
              fullWidth
              variant="standard"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleEdit();
                }
              }}
              onBlur={handleEdit}
              inputRef={inputRef}
              InputProps={{
                sx: {
                  fontSize: 'inherit',
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none' },
                }
              }}
            />
          ) : (
            <Typography
              sx={{
                flexGrow: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
                transition: 'all 0.3s ease',
                userSelect: 'none',
              }}
            >
              {todo.text}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                opacity: 0.7,
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <ImportantFlag
              isImportant={todo.important}
              onClick={handleToggleImportant}
              disabled={isTogglingImportant}
            />
            <IconButton
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{
                opacity: isDeleting ? 0.5 : 0.7,
                '&:hover': {
                  opacity: 1,
                  color: 'error.main',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </TodoContent>
    </TodoItem>
  );
});

SortableTodoItem.displayName = 'SortableTodoItem';

const DeleteConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Zoom}
      PaperProps={{
        elevation: 2,
        sx: {
          borderRadius: 2,
          minWidth: 320,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color='inherit'>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant='contained' color='error' autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const ProgressBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 4,
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
}))

const ProgressFill = styled(motion.div)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.success.main,
  position: 'absolute',
  left: 0,
  top: 0,
}))

const ProjectProgress = ({ todos }) => {
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const progress = total === 0 ? 0 : (completed / total) * 100

  return (
    <Box sx={{ mt: 1, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant='body2' color='text.secondary'>
          Progress: {completed}/{total} completed
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {Math.round(progress)}%
        </Typography>
      </Box>
      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </ProgressBar>
    </Box>
  )
}

// Update the project categories constant to include a more comprehensive default list
const DEFAULT_PROJECT_CATEGORIES = [
  'Personal',
  'Work',
  'Study',
  'AustriliaGO',
  'Shopping',
  'Health',
  'Family',
  'Home',
  'Finance',
  'Fitness',
  'Travel',
  'Other'
];

const ColorPickerPopover = ({ color, onChange, onClose, anchorEl }) => (
  <Popover
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    sx={{ mt: 1 }}
  >
    <Box sx={{ p: 2 }}>
      <ChromePicker color={color} onChange={color => onChange(color.hex)} />
      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{ mt: 2 }}
        size="small"
      >
        Confirm Color
      </Button>
    </Box>
  </Popover>
)

const ProjectForm = ({ onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    color: '#2196F3',
    ...initialValues,
  });
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState(DEFAULT_PROJECT_CATEGORIES);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    // Load saved categories and merge with defaults
    const loadCategories = () => {
      try {
        const savedCategories = localStorage.getItem('projectCategories');
        if (savedCategories) {
          const parsed = JSON.parse(savedCategories);
          const allCategories = [...new Set([...DEFAULT_PROJECT_CATEGORIES, ...parsed])];
          setCategories(allCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    // Ensure formData.category is always a valid value
    if (!categories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: 'Other' }));
    }
  }, [categories, formData.category]);

  const handleCustomCategorySubmit = () => {
    if (!customCategory.trim()) {
      setCategoryError('Category name cannot be empty');
      return;
    }

    const newCategory = customCategory.trim();
    if (categories.includes(newCategory)) {
      setCategoryError('This category already exists');
      return;
    }

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    
    // Save to localStorage
    try {
      const customCategories = updatedCategories.filter(cat => !DEFAULT_PROJECT_CATEGORIES.includes(cat));
      localStorage.setItem('projectCategories', JSON.stringify(customCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }

    // Update form data with new category
    setFormData(prev => ({ ...prev, category: newCategory })); // Correctly set the new category
    setCustomCategory('');
    setCategoryDialogOpen(false);
    setCategoryError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant='h6'>{initialValues?._id ? 'Edit Project' : 'Create New Project'}</Typography>
        <TextField
          fullWidth
          label='Project Name'
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <TextField
          fullWidth
          label='Description'
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          multiline
          rows={1}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: '8px 14px',  // Adjust padding
            },
          }}
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            defaultValue={"Other"}
            label="Category"
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    ml: 0.5
                  }}
                />
                {selected}
              </Box>
            )}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <ListSubheader>Default Categories</ListSubheader>
            {DEFAULT_PROJECT_CATEGORIES.map(category => (
              <MenuItem key={category} value={category} sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: 28, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: formData.category === category ? 'primary.main' : 'action.disabled',
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={category} sx={{ m: 0 }} />
              </MenuItem>
            ))}

            <ListSubheader>Custom Categories</ListSubheader>
            {categories
              .filter(cat => !DEFAULT_PROJECT_CATEGORIES.includes(cat))
              .map(category => (
                <MenuItem 
                  key={category} 
                  value={category}  // This is correct
                  onClick={() => setFormData(prev => ({ ...prev, category }))} // Add this line if needed
                  sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center' }}
                >
                  <ListItemIcon sx={{ minWidth: 28, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: formData.category === category ? 'primary.main' : 'action.disabled',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={category} sx={{ m: 0 }} />
                </MenuItem>
              ))}

            <Divider />
            <MenuItem 
              value="ADD_CUSTOM"
              onClick={() => setCategoryDialogOpen(true)}
              sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}
            >
              <ListItemIcon sx={{ minWidth: 28, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddIcon fontSize="small" color="inherit" />
              </ListItemIcon>
              <ListItemText primary="Add Custom Category" sx={{ m: 0 }} />
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label='Color'
          value={formData.color}
          onClick={e => setColorPickerAnchor(e.currentTarget)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: formData.color,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />
        <ColorPickerPopover
          color={formData.color}
          onChange={color => setFormData({ ...formData, color })}
          onClose={() => setColorPickerAnchor(null)}
          anchorEl={colorPickerAnchor}
        />

        <Dialog
          open={categoryDialogOpen}
          onClose={() => {
            setCategoryDialogOpen(false);
            setCategoryError('');
            setCustomCategory('');
          }}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Add Custom Category</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Category Name"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setCategoryError('');
                }}
                error={Boolean(categoryError)}
                helperText={categoryError}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomCategorySubmit();
                  }
                }}
                InputProps={{
                  sx: {
                    '& input': {
                      fontSize: '1rem',
                    }
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => {
                setCategoryDialogOpen(false);
                setCategoryError('');
                setCustomCategory('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCustomCategorySubmit}
              variant="contained"
              disabled={!customCategory.trim()}
            >
              Add Category
            </Button>
          </DialogActions>
        </Dialog>

        <Button 
          fullWidth 
          variant='contained' 
          type='submit' 
          disabled={!formData.name}
        >
          {initialValues?._id ? 'Update Project' : 'Create Project'}
        </Button>
      </Stack>
    </form>
  );
};

const HelpDialog = ({ open, onClose }) => {
  const shortcuts = [
    { key: 'Alt + P', description: 'Toggle project panel' },
    { key: 'Alt + N', description: 'Focus todo input' },
    { key: 'Alt + /', description: 'Focus todo input (alternative)' },
    { key: 'Alt + J', description: 'Move todo down' },
    { key: 'Alt + K', description: 'Move todo up' },
    { key: 'Alt + X', description: 'Toggle todo completion' },
    { key: 'Alt + D', description: 'Delete todo' },
    { key: 'Enter', description: 'Add new todo when input is focused' },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth TransitionComponent={Zoom}>
      <DialogTitle>
        Keyboard Shortcuts
        <IconButton aria-label='close' onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List sx={{ py: 0 }}>
          {shortcuts.map((shortcut, index) => (
            <ListItem key={shortcut.key} divider={index < shortcuts.length - 1}>
              <ListItemText
                primary={shortcut.description}
                secondary={
                  <Typography
                    component='span'
                    variant='body2'
                    sx={{
                      display: 'inline-block',
                      bgcolor: 'action.selected',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    {shortcut.key}
                  </Typography>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

function TodoApp() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodoText, setNewTodoText] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState({ projects: false, todos: false })
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth >= 600)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null, // 'todo' or 'project'
    itemId: null,
    title: '',
    content: '',
  })
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch projects with loading state
  const fetchProjects = useCallback(async () => {
    setLoading(prev => ({ ...prev, projects: true }))
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, projects: false }))
    }
  }, [selectedProject])

  // Fetch todos with loading state
  const fetchTodos = useCallback(async () => {
    if (!selectedProject) return
    setLoading(prev => ({ ...prev, todos: true }))
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/project/${selectedProject._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError('Failed to load todos')
    } finally {
      setLoading(prev => ({ ...prev, todos: false }))
    }
  }, [selectedProject])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user, fetchProjects])

  useEffect(() => {
    if (selectedProject) {
      fetchTodos()
    }
  }, [selectedProject, fetchTodos])

  const handleAddProject = async projectData => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectData),
      })
      if (!response.ok) throw new Error('Failed to create project')
      const project = await response.json()
      setProjects(prev => [...prev, project])
      setSelectedProject(project)
      setProjectDialogOpen(false)
    } catch (err) {
      setError('Failed to create project')
    }
  }

  // Add todo with optimistic update
  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return

    const optimisticTodo = {
      _id: Date.now().toString(), // temporary ID
      text: newTodoText,
      completed: false,
      project: selectedProject._id,
    }

    setTodos(prev => [optimisticTodo, ...prev])
    setNewTodoText('')

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
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create todo')
      }

      const actualTodo = await response.json()
      setTodos(prev => prev.map(t => (t._id === optimisticTodo._id ? actualTodo : t)))
    } catch (err) {
      setTodos(prev => prev.filter(t => t._id !== optimisticTodo._id))
      setError(err.message)
    }
  }

  // Optimistic update for todo toggle
  const handleToggleTodo = async todoId => {
    const originalTodos = [...todos]
    const todoIndex = todos.findIndex(t => t._id === todoId)
    const updatedTodo = { ...todos[todoIndex], completed: !todos[todoIndex].completed }

    // Optimistic update
    setTodos(prev => prev.map(t => (t._id === todoId ? updatedTodo : t)))

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
      
      const data = await response.json()
      // Only update if the response is successful
      setTodos(prev => prev.map(t => (t._id === todoId ? data : t)))
    } catch (err) {
      // Revert on failure
      setTodos(originalTodos)
      setError('Failed to update todo status')
    }
  }

  const handleDeleteTodo = async todoId => {
    // Store original todos for rollback
    const originalTodos = [...todos]
    // Optimistic update
    setTodos(prev => prev.filter(t => t._id !== todoId))

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }
    } catch (err) {
      // Revert on failure
      setTodos(originalTodos)
      setError('Failed to delete todo')
    }
  }

  const handleDeleteProject = async projectId => {
    setDeleteDialog({
      open: true,
      type: 'project',
      itemId: projectId,
      title: 'Delete Project',
      content: 'Are you sure? This will delete all todos in this project. This action cannot be undone.',
    })
  }

  const handleDeleteConfirm = async () => {
    const { type, itemId } = deleteDialog
    try {
      if (type === 'todo') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!response.ok) throw new Error('Failed to delete todo')
        setTodos(todos.filter(t => t._id !== itemId))
      } else if (type === 'project') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!response.ok) throw new Error('Failed to delete project')
        setProjects(projects.filter(p => p._id !== itemId))
        if (selectedProject?._id === itemId) {
          setSelectedProject(projects.find(p => p._id !== itemId) || null)
        }
      }
    } catch (err) {
      setError(`Failed to delete ${type}`)
    } finally {
      setDeleteDialog(prev => ({ ...prev, open: false }))
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog(prev => ({ ...prev, open: false }))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const saveTodoOrder = async reorderedTodos => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ todos: reorderedTodos }),
      })

      if (!response.ok) {
        throw new Error('Failed to save todo order')
      }
    } catch (err) {
      setError('Failed to save todo order')
    }
  }

  // Update the handleDragEnd function
  const handleDragEnd = event => {
    const { active, over } = event

    if (active.id !== over.id) {
      setTodos(items => {
        const oldIndex = items.findIndex(item => item._id === active.id)
        const newIndex = items.findIndex(item => item._id === over.id)
        const draggedItem = items[oldIndex];
        const targetItem = items[newIndex];

        // Prevent non-important items from being dragged above important items
        if (!draggedItem.important && targetItem.important) {
          return items;
        }

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Save the new order to the server
        saveTodoOrder(newItems)

        return newItems
      })
    }
  }

  const handleEditProject = async projectData => {
    if (!editingProject) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/projects/${editingProject._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectData),
      })
      if (!response.ok) throw new Error('Failed to update project')
      const updatedProject = await response.json()
      setProjects(prev => prev.map(p => (p._id === updatedProject._id ? updatedProject : p)))
      if (selectedProject?._id === updatedProject._id) {
        setSelectedProject(updatedProject)
      }
      setEditingProject(null)
      setProjectDialogOpen(false)
    } catch (err) {
      setError('Failed to update project')
    }
  }

  const handleToggleImportant = async todoId => {
    const originalTodos = [...todos];
    const todoIndex = todos.findIndex(t => t._id === todoId);
    const updatedTodo = { ...todos[todoIndex], important: !todos[todoIndex].important };

    // Calculate new position for optimistic update
    const newTodos = [...todos];
    newTodos.splice(todoIndex, 1); // Remove from current position
    if (updatedTodo.important) {
      // Find position after other important items
      const lastImportantIndex = newTodos.findIndex(t => !t.important);
      const insertIndex = lastImportantIndex === -1 ? newTodos.length : lastImportantIndex;
      newTodos.splice(insertIndex, 0, updatedTodo);
    } else {
      // Find position among non-important items
      const firstNonImportantIndex = newTodos.findIndex(t => !t.important);
      newTodos.splice(firstNonImportantIndex, 0, updatedTodo);
    }

    // Optimistic update with sorted todos
    setTodos(newTodos);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          important: updatedTodo.important,
          order: newTodos.findIndex(t => t._id === todoId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo importance');
      }
      
      await fetchTodos(); // Refresh todos to get server-side sorting
    } catch (err) {
      // Revert on failure
      setTodos(originalTodos);
      setError('Failed to update todo importance');
    }
  };

  const handleToggleAllTodos = async (completed) => {
    // Store original todos for rollback
    const originalTodos = [...todos];
    
    // Optimistically update UI
    const updatedTodos = todos.map(todo => ({ ...todo, completed }));
    setTodos(updatedTodos);
  
    try {
      // Use Promise.all to handle all toggle requests concurrently
      await Promise.all(
        todos
          .filter(todo => todo.completed !== completed) // Only toggle todos that need to change
          .map(todo =>
            fetch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ completed }),
            })
          )
      );
  
      // Refresh todos to ensure synchronization
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todos');
      setTodos(originalTodos); // Revert on failure
    }
  };

  const handleProjectSelect = (project) => {
    // Close drawer only on mobile devices
    if (window.innerWidth < 700) {
      setDrawerOpen(false);
    }
  };

  return (
    <PageTransition initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <MenuButton
          color='primary'
          aria-label='toggle drawer'
          onClick={() => setDrawerOpen(!drawerOpen)}
          open={drawerOpen}
        >
          <MenuIcon sx={{ transform: drawerOpen ? 'rotate(180deg)' : 'none' }} />
        </MenuButton>

        <StyledDrawer variant='persistent' anchor='left' open={drawerOpen}>
          <DrawerHeader />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
                Projects
              </Typography>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setProjectDialogOpen(true)}>
                New Project
              </Button>
            </Box>

            {loading.projects ? (
              <LoadingAnimation
                animate={{
                  backgroundPosition: ['100% 0%', '-100% 0%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ) : (
              <motion.div layout>
                <List>
                  <AnimatePresence>
                    {projects.map(project => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProjectItem
                          project={project}
                          selected={selectedProject?._id === project._id}
                          onClick={() => setSelectedProject(project)}
                          onEdit={() => setEditingProject(project)}
                          onDelete={() => handleDeleteProject(project._id)}
                          onSelect={handleProjectSelect}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </List>
              </motion.div>
            )}
          </Box>
        </StyledDrawer>

        <Main open={drawerOpen}>
          <DrawerHeader />
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </motion.div>
          )}

          <StyledContainer>
            {selectedProject ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Typography
                  variant='h4'
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {selectedProject.name}
                </Typography>

                <ProjectProgress todos={todos} />

                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <StyledTextField
                    fullWidth
                    value={newTodoText}
                    onChange={e => setNewTodoText(e.target.value)}
                    placeholder='What needs to be done?'
                    sx={{ mb: 2 }}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && newTodoText) {
                        handleAddTodo();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant='contained'
                          startIcon={<AddIcon />}
                          onClick={handleAddTodo}
                          disabled={!newTodoText}
                          sx={{
                            borderRadius: '0 4px 4px 0',
                            height: '80%',
                            margin: '-1px',
                          }}
                        >
                          Add
                        </Button>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button variant='contained' onClick={() => handleToggleAllTodos(true)}>
                    Check All
                  </Button>
                  <Button variant='outlined' onClick={() => handleToggleAllTodos(false)}>
                    Uncheck All
                  </Button>
                </Box>


                {loading.todos ? (
                  <LoadingAnimation
                    animate={{
                      backgroundPosition: ['100% 0%', '-100% 0%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ) : todos.length === 0 ? (
                  <EmptyState>
                    <CheckIcon />
                    <Typography variant='h6'>No todos yet</Typography>
                    <Typography>Add your first todo to get started</Typography>
                  </EmptyState>
                ) : (
                  <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                    modifiers={[]} // Remove any modifiers that might interfere with clicking
                  >
                    <SortableContext 
                      items={todos.map(t => t._id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <motion.div layout>
                        <AnimatePresence mode='popLayout'>
                          {todos.map((todo) => (
                            <SortableTodoItem
                              key={todo._id}
                              todo={todo}
                              onDelete={handleDeleteTodo}
                              onToggle={handleToggleTodo}
                              onToggleImportant={handleToggleImportant}
                            />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </SortableContext>
                  </DndContext>
                )}
              </motion.div>
            ) : (
              <EmptyState>
                <FolderIcon />
                <Typography variant='h6'>No project selected</Typography>
                <Typography>Select or create a project to get started</Typography>
              </EmptyState>
            )}
          </StyledContainer>
        </Main>
      </Box>
      <DeleteConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        content={deleteDialog.content}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <Dialog open={projectDialogOpen || Boolean(editingProject)} onClose={() => {
        setProjectDialogOpen(false);
        setEditingProject(null);
      }} maxWidth='sm' fullWidth>
        <DialogContent>
          <ProjectForm 
            onSubmit={editingProject ? handleEditProject : handleAddProject} 
            initialValues={editingProject} 
            title={editingProject ? 'Edit Project' : 'Create New Project'} 
          />
        </DialogContent>
      </Dialog>

      <HelpDialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} />
    </PageTransition>
  )
}

export default TodoApp

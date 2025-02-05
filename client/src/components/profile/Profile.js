import React from 'react'
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material'
import {
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className='profile-container'>
        <Paper elevation={3} className='profile-paper'>
          <Typography variant='h6'>Please log in to view your profile</Typography>
        </Paper>
      </div>
    )
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className='profile-container'>
      <Paper elevation={3} className='profile-paper'>
        <Box className='profile-header'>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 120, height: 120 }} className='profile-avatar'>
            {user.name?.charAt(0)}
          </Avatar>
          <Typography variant='h4' className='profile-name'>
            {user.name}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            {user.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <List className='profile-details'>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary='Email' secondary={user.email} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <PersonIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary='Username' secondary={user.name} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CalendarIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary='Joined' secondary={formatDate(user.createdAt)} />
          </ListItem>
        </List>

        <Box className='profile-actions'>
          <Button
            variant='contained'
            startIcon={<EditIcon />}
            onClick={() => {
              /* Add edit profile functionality */
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </div>
  )
}

export default Profile

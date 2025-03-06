import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      handleClose()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Tools', path: '/tools' },
    { text: 'GlbGuides', path: '/glbguides' },
    { text: 'FullStack', path: '/fullstack' },
    { text: 'Games', path: '/games' },
    { text: 'Menu', path: '/menu' },
    { text: 'Travel', path: '/travel' },
    { text: 'Food', path: '/food' },
    { text: 'Contact', path: '/contact' },
  ]

  const drawer = (
    <List>
      {navItems.map(item => (
        <ListItem button key={item.text} component={Link} to={item.path} onClick={handleDrawerToggle}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  )

  return (
    <AppBar position='static'>
      <Toolbar className='navbar'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          className='menu-button'
        >
          <MenuIcon />
        </IconButton>

        <Typography variant='h6' component={Link} to='/' className='navbar-brand'>
          DevLifeHub
        </Typography>

        <div className='navbar-links'>
          {navItems.map(item => (
            <Button key={item.text} color='inherit' component={Link} to={item.path}>
              {item.text}
            </Button>
          ))}
        </div>

        <div className='navbar-auth'>
          {user ? (
            <>
              <Button
                color='inherit'
                onClick={handleMenu}
                startIcon={
                  <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }}>
                    {user.name?.charAt(0)}
                  </Avatar>
                }
              >
                {user.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to='/profile' onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color='inherit' component={Link} to='/login'>
              Login
            </Button>
          )}
        </div>
      </Toolbar>

      <Drawer
        variant='temporary'
        anchor='left'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        className='mobile-drawer'
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
}

export default Navbar

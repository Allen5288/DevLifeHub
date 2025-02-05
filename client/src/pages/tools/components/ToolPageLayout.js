import React from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function ToolPageLayout({ title, description, children }) {
  const navigate = useNavigate()

  return (
    <Container maxWidth='xl' className='tool-page'>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/tools')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <div>
            <Typography variant='h4' component='h1'>
              {title}
            </Typography>
            {description && (
              <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
                {description}
              </Typography>
            )}
          </div>
        </Box>
        {children}
      </Box>
    </Container>
  )
}

export default ToolPageLayout

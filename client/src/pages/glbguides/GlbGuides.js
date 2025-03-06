import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Grid, Paper } from '@mui/material'

function GlbGuides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // You can fetch guides data from your API here
    // For now, we'll use placeholder data
    const placeholderGuides = [
      {
        id: 1,
        title: 'Getting Started with Global Guides',
        description: 'Learn the basics of navigating our global guides platform.',
        category: 'Beginner',
        imageUrl: 'https://source.unsplash.com/random/300x200/?world',
      },
      {
        id: 2,
        title: 'Advanced Global Navigation Techniques',
        description: 'Master the art of global navigation with these expert tips.',
        category: 'Advanced',
        imageUrl: 'https://source.unsplash.com/random/300x200/?map',
      },
      {
        id: 3,
        title: 'Regional Exploration Strategies',
        description: 'Discover effective methods for exploring different global regions.',
        category: 'Intermediate',
        imageUrl: 'https://source.unsplash.com/random/300x200/?travel',
      },
    ]

    // Simulate API fetch with setTimeout
    setTimeout(() => {
      setGuides(placeholderGuides)
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h5">Loading guides...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h5" color="error">
          Error loading guides: {error.message}
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Global Guides
      </Typography>
      <Typography variant="h6" paragraph align="center" sx={{ mb: 6 }}>
        Explore our comprehensive collection of global guides to enhance your knowledge and skills
      </Typography>

      <Grid container spacing={4}>
        {guides.map((guide) => (
          <Grid item key={guide.id} xs={12} sm={6} md={4}>
            <Paper 
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
              }}
              elevation={2}
            >
              <img 
                src={guide.imageUrl} 
                alt={guide.title} 
                style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 16, borderRadius: 4 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="primary" fontWeight="bold">
                  {guide.category}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  {guide.title}
                </Typography>
                <Typography variant="body2" paragraph>
                  {guide.description}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography 
                  variant="button" 
                  color="primary" 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Read More →
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default GlbGuides
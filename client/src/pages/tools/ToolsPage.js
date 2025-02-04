import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TOOLS_CONFIG } from './config/toolsConfig';
import './Tools.css';

function ToolsPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" className="tools-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Developer Tools
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {TOOLS_CONFIG.map((tool) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
            <Card className="tool-card" onClick={() => navigate(tool.path)} sx={{ cursor: 'pointer' }}>
              <CardActionArea>
                <CardContent className="tool-card-content">
                  <tool.icon className="tool-icon" />
                  <Typography variant="h6" component="h2">
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ToolsPage;
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  IconButton,
  Stack,
  ButtonGroup,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import LoveDiaryForm from './LoveDiaryForm'
import html2canvas from 'html2canvas'
import './LoveDiary.css'

const LoveDiary = () => {
  const [entries, setEntries] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [eventType, setEventType] = useState(null); // 'regular' or 'big-event'
  const token = localStorage.getItem('token')

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/love-diary', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch entries')
      const data = await response.json()
      // Sort entries by date in descending order (newest first)
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date))
      setEntries(sortedData)
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }, [token])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        const response = await fetch(`/api/love-diary/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Failed to delete entry')
        setEntries(entries.filter(entry => entry._id !== id))
      } catch (error) {
        console.error('Error deleting entry:', error)
      }
    }
  }

  const handleFormSubmit = async formData => {
    try {
      const url = editEntry ? `/api/love-diary/${editEntry._id}` : '/api/love-diary'
      const method = editEntry ? 'PUT' : 'POST'

      // Create a clean form data object with explicit type flag
      const dataToSubmit = { ...formData }
      
      // Override type based on the current context
      if (editEntry) {
        // When editing, keep the original type unless explicitly changed
        dataToSubmit.type = editEntry.type;
      } else {
        // For new entries, set type based on which button was clicked
        dataToSubmit.type = eventType
      }

      const form = new FormData()
      Object.keys(dataToSubmit).forEach(key => {
        // For boolean values, convert to string to ensure proper transmission
        if (typeof dataToSubmit[key] === 'boolean') {
          form.append(key, dataToSubmit[key].toString())
        } else if (dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
          form.append(key, dataToSubmit[key])
        }
      })


      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      if (!response.ok) throw new Error('Failed to save entry')
      const savedEntry = await response.json()

      if (editEntry) {
        setEntries(prevEntries => {
          const updated = prevEntries.map(e => (e._id === editEntry._id ? savedEntry : e))
          return updated.sort((a, b) => new Date(b.date) - new Date(a.date))
        })
      } else {
        setEntries(prevEntries => {
          const updated = [savedEntry, ...prevEntries]
          return updated.sort((a, b) => new Date(b.date) - new Date(a.date))
        })
      }

      setOpenForm(false)
      setEditEntry(null)
      setEventType(null)
    } catch (error) {
      console.error('Error saving entry:', error)
    }
  }

  const handleExport = async entry => {
    try {
      const element = document.getElementById(`diary-entry-${entry._id}`)
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `memory-${entry.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error exporting entry:', error)
    }
  }

  const handleExportAll = async () => {
    try {
      const element = document.querySelector('.diary-grid')
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const link = document.createElement('a')
      link.download = `love-diary-export-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error exporting all memories:', error)
    }
  }

  const handleAddClick = (type) => {
    setEventType(type);
    setOpenForm(true);
  };

  // Separate entries by type
  const regularEntries = entries.filter(entry => entry.type === 'regular');
  const bigEventEntries = entries.filter(entry => entry.type === 'big-event');

  // When editing, we need to set the correct event type
  const handleEditClick = (entry) => {
    setEditEntry(entry)
    setEventType(entry.type)
    setOpenForm(true)
  }

  return (
    <Box className='love-diary-container'>
      <Stack direction='row' justifyContent='space-between' alignItems='center' className='diary-header'>
        <Typography variant='h4'>Love Diary</Typography>
        <ButtonGroup>
          <Button 
            variant='contained' 
            sx={{ mr: 1 }} 
            startIcon={<AddIcon />} 
            onClick={() => handleAddClick('regular')}
          >
            Add Memory
          </Button>
          <Button 
            variant='contained' 
            color="secondary"
            sx={{ mr: 1 }} 
            startIcon={<AddIcon />} 
            onClick={() => handleAddClick('big-event')}
          >
            Add Big Event
          </Button>
          <Button 
            variant='outlined' 
            startIcon={<FileDownloadIcon />} 
            onClick={handleExportAll}
          >
            Export All
          </Button>
        </ButtonGroup>
      </Stack>

      {/* Regular Memories Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 2, mt: 3 }}>
          Must Do Things With My Love ❤️
        </Typography>
        <Grid container spacing={1} className='diary-grid'>
          {regularEntries.map(entry => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={entry._id}>
              <Card
                id={`diary-entry-${entry._id}`}
                className='diary-card'
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {entry.image && (
                  <CardMedia
                    component='img'
                    height='120'
                    image={entry.image}
                    alt={entry.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    {entry.title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary' className='diary-date'>
                    {new Date(entry.date).toLocaleDateString()}
                  </Typography>
                  {entry.summary && (
                    <Typography variant='body2' className='diary-summary' sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                      {entry.summary}
                    </Typography>
                  )}
                  <Stack direction='row' spacing={0.5} sx={{ mt: 1 }}>
                    <IconButton size='small' onClick={() => handleDelete(entry._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size='small' onClick={() => handleExport(entry)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleEditClick(entry)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Big Events Section */}
      <Box>
        <Typography variant='h5' sx={{ mb: 2, mt: 4 }}>
          Our Big Events 🎉
        </Typography>
        <Grid container spacing={1} className='diary-grid'>
          {bigEventEntries.map(entry => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={entry._id}>
              <Card
                id={`diary-entry-${entry._id}`}
                className='diary-card'
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {entry.image && (
                  <CardMedia
                    component='img'
                    height='120'
                    image={entry.image}
                    alt={entry.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    {entry.title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary' className='diary-date'>
                    {new Date(entry.date).toLocaleDateString()}
                  </Typography>
                  {entry.summary && (
                    <Typography variant='body2' className='diary-summary' sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                      {entry.summary}
                    </Typography>
                  )}
                  <Stack direction='row' spacing={0.5} sx={{ mt: 1 }}>
                    <IconButton size='small' onClick={() => handleDelete(entry._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size='small' onClick={() => handleExport(entry)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleEditClick(entry)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setEditEntry(null)
          setEventType(null)
        }}
        maxWidth='sm'
        fullWidth
      >
        <LoveDiaryForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setOpenForm(false)
            setEditEntry(null)
            setEventType(null)
          }}
          initialData={editEntry}
          eventType={eventType}
        />
      </Dialog>
    </Box>
  )
}

export default LoveDiary

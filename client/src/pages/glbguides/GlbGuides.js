import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Snackbar,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import PreviewIcon from '@mui/icons-material/Preview';
import LockIcon from '@mui/icons-material/Lock';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { toast } from 'react-toastify';
import './GlbGuides.css';

// Add a utility function for handling retries with exponential backoff
const retryRequest = async (requestFn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0;
  let delay = initialDelay;
  
  while (retries < maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response && error.response.status === 429 && retries < maxRetries - 1) {
        // If we hit rate limit, wait and retry
        retries++;
        // Exponential backoff with jitter
        const jitter = Math.random() * 0.3 + 0.85; // Random factor between 0.85-1.15
        await new Promise(resolve => setTimeout(resolve, delay * jitter));
        delay *= 2; // Exponential backoff
        console.log(`Retrying request (${retries}/${maxRetries}) after ${delay}ms delay`);
      } else {
        throw error;
      }
    }
  }
};

function GlbGuides() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [countryData, setCountryData] = useState(null);
  
  // Dialog states
  const [openAddCountry, setOpenAddCountry] = useState(false);
  const [openAddContent, setOpenAddContent] = useState(false);
  const [openEditContent, setOpenEditContent] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  
  // Form states
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [password, setPassword] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState('markdown');
  const [contentBody, setContentBody] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [currentAction, setCurrentAction] = useState(''); // 'addCountry', 'addContent', 'editContent', 'deleteContent'
  const [editingContentId, setEditingContentId] = useState('');
  const [deletingContentId, setDeletingContentId] = useState('');
  const [retryingRequest, setRetryingRequest] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries, setMaxRetries] = useState(3);
  const [retrySnackbarOpen, setRetrySnackbarOpen] = useState(false);
  
  // Load countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);
  
  // Load country data when selecting a country
  useEffect(() => {
    if (selectedCountry) {
      fetchCountryData(selectedCountry);
    }
  }, [selectedCountry]);
  
  // Fetch all countries from the API with retry logic
  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const response = await retryRequest(
        async () => {
          try {
            return await axios.get('/api/glbguides/countries');
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error; // Rethrow to trigger retry
            }
            throw error; // Rethrow other errors
          }
        },
        3,
        1000
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      setRetrySnackbarOpen(false);
      
      setCountries(response.data);
      if (response.data.length > 0 && !selectedCountry) {
        setSelectedCountry(response.data[0].countryCode);
      }
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to fetch countries:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error('Failed to load countries');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data for a specific country with retry logic
  const fetchCountryData = async (countryCode) => {
    setIsLoading(true);
    try {
      const response = await retryRequest(
        async () => {
          try {
            return await axios.get(`/api/glbguides/country/${countryCode}`);
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error; // Rethrow to trigger retry
            }
            throw error; // Rethrow other errors
          }
        },
        3,
        1000
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      setRetrySnackbarOpen(false);
      
      setCountryData(response.data);
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to fetch country data:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error('Failed to load country data');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password verification
  const verifyPassword = () => {
    if (password === process.env.REACT_APP_GLBGUIDE_PASSWORDS) {
      setPasswordVerified(true);
      setOpenPasswordDialog(false);
      // Proceed with the operation that needed password verification
      if (currentAction === 'addCountry') {
        setOpenAddCountry(true);
      } else if (currentAction === 'addContent') {
        setOpenAddContent(true);
      } else if (currentAction === 'editContent') {
        setOpenEditContent(true);
      } else if (currentAction === 'deleteContent') {
        setOpenDeleteConfirm(true);
      }
    } else {
      toast.error('Invalid password');
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Open password dialog when trying to perform protected actions
  const handleOpenPasswordDialog = (action, contentId = '', section = '') => {
    setCurrentAction(action);
    
    if (action === 'editContent' || action === 'deleteContent') {
      // Store which content we're editing or deleting
      if (action === 'editContent') {
        setEditingContentId(contentId);
        
        // Pre-fill the edit form with the content data
        const content = countryData[section].find(item => item._id === contentId);
        if (content) {
          setContentTitle(content.title);
          setContentType(content.contentType);
          setContentBody(content.content);
          setSelectedSection(section);
        }
      } else if (action === 'deleteContent') {
        setDeletingContentId(contentId);
        setSelectedSection(section);
      }
    }
    
    if (passwordVerified) {
      // If password already verified, perform the action directly
      if (action === 'addCountry') {
        setOpenAddCountry(true);
      } else if (action === 'addContent') {
        setOpenAddContent(true);
      } else if (action === 'editContent') {
        setOpenEditContent(true);
      } else if (action === 'deleteContent') {
        setOpenDeleteConfirm(true);
      }
    } else {
      // Otherwise open the password dialog
      setOpenPasswordDialog(true);
      setPassword('');
    }
  };
  
  // Handle adding a new country
  const handleAddCountrySubmit = async () => {
    try {
      setIsLoading(true);
      const response = await retryRequest(
        async () => {
          try {
            return await axios.post('/api/glbguides/country', {
              country: countryName,
              countryCode,
              password: password || process.env.REACT_APP_GLBGUIDE_PASSWORDS
            });
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error;
            }
            throw error;
          }
        }
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      
      toast.success('Country added successfully');
      setOpenAddCountry(false);
      setCountryName('');
      setCountryCode('');
      fetchCountries();
      
      // Select the newly added country
      setSelectedCountry(countryCode);
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to add country:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add country');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding content to a country
  const handleAddContentSubmit = async () => {
    try {
      setIsLoading(true);
      
      const response = await retryRequest(
        async () => {
          try {
            return await axios.post('/api/glbguides/content', {
              countryCode: selectedCountry,
              section: selectedSection,
              title: contentTitle,
              contentType,
              content: contentBody,
              password: password || process.env.REACT_APP_GLBGUIDE_PASSWORDS
            });
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error;
            }
            throw error;
          }
        }
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      
      toast.success('Content added successfully');
      setOpenAddContent(false);
      resetContentForm();
      fetchCountryData(selectedCountry);
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to add content:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing content
  const handleEditContentSubmit = async () => {
    try {
      setIsLoading(true);
      
      const response = await retryRequest(
        async () => {
          try {
            return await axios.put('/api/glbguides/content', {
              countryCode: selectedCountry,
              section: selectedSection,
              contentId: editingContentId,
              title: contentTitle,
              content: contentBody,
              password: password || process.env.REACT_APP_GLBGUIDE_PASSWORDS
            });
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error;
            }
            throw error;
          }
        }
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      
      toast.success('Content updated successfully');
      setOpenEditContent(false);
      resetContentForm();
      fetchCountryData(selectedCountry);
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to update content:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting content
  const handleDeleteContent = async () => {
    try {
      setIsLoading(true);
      
      const response = await retryRequest(
        async () => {
          try {
            return await axios.delete('/api/glbguides/content', {
              data: {
                countryCode: selectedCountry,
                section: selectedSection,
                contentId: deletingContentId,
                password: password || process.env.REACT_APP_GLBGUIDE_PASSWORDS
              }
            });
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setRetryingRequest(true);
              setRetrySnackbarOpen(true);
              setRetryCount(prev => prev + 1);
              throw error;
            }
            throw error;
          }
        }
      );
      
      setRetryingRequest(false);
      setRetryCount(0);
      
      toast.success('Content deleted successfully');
      setOpenDeleteConfirm(false);
      fetchCountryData(selectedCountry);
    } catch (error) {
      setRetryingRequest(false);
      console.error('Failed to delete content:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete content');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset content form fields
  const resetContentForm = () => {
    setContentTitle('');
    setContentType('markdown');
    setContentBody('');
    setSelectedSection('');
    setEditingContentId('');
    setDeletingContentId('');
  };
  
  // Handle opening preview dialog
  const handleOpenPreview = (content) => {
    setPreviewContent(content);
    setOpenPreview(true);
  };
  
  // Render content based on its type (link or markdown)
  const renderContent = (content, section) => {
    if (content.contentType === 'link') {
      return (
        <Card variant="outlined" sx={{ mb: 2 }} className="content-card">
          <CardContent>
            <Typography variant="h6">{content.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinkIcon sx={{ mr: 1 }} />
              <Typography component="a" href={content.content} target="_blank" rel="noopener noreferrer">
                {content.content}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              startIcon={<PreviewIcon />}
              size="small" 
              onClick={() => handleOpenPreview(content)}
            >
              Preview
            </Button>
            <Button
              startIcon={<EditIcon />}
              size="small"
              color="primary"
              onClick={() => handleOpenPasswordDialog('editContent', content._id, section)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              color="error"
              onClick={() => handleOpenPasswordDialog('deleteContent', content._id, section)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      );
    } else {
      return (
        <Card variant="outlined" sx={{ mb: 2 }} className="content-card">
          <CardContent>
            <Typography variant="h6">{content.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <DescriptionIcon sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Markdown content
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              startIcon={<PreviewIcon />}
              size="small" 
              onClick={() => handleOpenPreview(content)}
            >
              Preview
            </Button>
            <Button
              startIcon={<EditIcon />}
              size="small"
              color="primary"
              onClick={() => handleOpenPasswordDialog('editContent', content._id, section)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              color="error"
              onClick={() => handleOpenPasswordDialog('deleteContent', content._id, section)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Global Life Guides
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This is a global platform. All content added here will be visible to all users. Please ensure your contributions follow community guidelines.
      </Alert>
      
      {/* Country Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Select Country</InputLabel>
          <Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            label="Select Country"
          >
            {countries.map((country) => (
              <MenuItem key={country.countryCode} value={country.countryCode}>
                {country.country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Tooltip title="Password required to add country">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            endIcon={<LockIcon fontSize="small" />}
            onClick={() => handleOpenPasswordDialog('addCountry')}
          >
            Add Country
          </Button>
        </Tooltip>
      </Box>
      
      {/* Content Tabs */}
      {countryData && (
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Big Events" />
            <Tab label="Local Guide Tips" />
          </Tabs>
          
          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {currentTab === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Big Events in {countryData.country}</Typography>
                  <Tooltip title="Password required to add content">
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      endIcon={<LockIcon fontSize="small" />}
                      onClick={() => {
                        setSelectedSection('bigEvents');
                        handleOpenPasswordDialog('addContent');
                      }}
                    >
                      Add Event
                    </Button>
                  </Tooltip>
                </Box>
                
                {countryData.bigEvents.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    No big events added yet.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {countryData.bigEvents.map((event) => (
                      <Grid item xs={12} md={6} key={event._id}>
                        {renderContent(event, 'bigEvents')}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
            
            {currentTab === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Local Guide Tips for {countryData.country}</Typography>
                  <Tooltip title="Password required to add content">
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      endIcon={<LockIcon fontSize="small" />}
                      onClick={() => {
                        setSelectedSection('localGuides');
                        handleOpenPasswordDialog('addContent');
                      }}
                    >
                      Add Guide Tip
                    </Button>
                  </Tooltip>
                </Box>
                
                {countryData.localGuides.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    No local guide tips added yet.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {countryData.localGuides.map((guide) => (
                      <Grid item xs={12} md={6} key={guide._id}>
                        {renderContent(guide, 'localGuides')}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Paper>
      )}
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {retryingRequest && (
        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Rate limit detected. Retrying request ({retryCount}/{maxRetries})...
          </Typography>
          <LinearProgress />
        </Box>
      )}
      
      {/* Add Country Dialog */}
      <Dialog open={openAddCountry} onClose={() => setOpenAddCountry(false)}>
        <DialogTitle>Add New Country</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Country Name"
            fullWidth
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Country Code (e.g., US, JP)"
            fullWidth
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCountry(false)}>Cancel</Button>
          <Button onClick={handleAddCountrySubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Content Dialog */}
      <Dialog
        open={openAddContent}
        onClose={() => setOpenAddContent(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Add {selectedSection === 'bigEvents' ? 'Big Event' : 'Local Guide Tip'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              label="Content Type"
            >
              <MenuItem value="markdown">Markdown</MenuItem>
              <MenuItem value="link">Link to External Website</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label={contentType === 'link' ? 'URL' : 'Content (Markdown supported)'}
            fullWidth
            multiline={contentType === 'markdown'}
            rows={contentType === 'markdown' ? 10 : 1}
            value={contentBody}
            onChange={(e) => setContentBody(e.target.value)}
          />
          
          {contentType === 'markdown' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Preview:</Typography>
              <Paper sx={{ p: 2, maxHeight: '300px', overflow: 'auto' }} className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {contentBody}
                </ReactMarkdown>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddContent(false)}>Cancel</Button>
          <Button onClick={handleAddContentSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog
        open={openEditContent}
        onClose={() => setOpenEditContent(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Edit {selectedSection === 'bigEvents' ? 'Big Event' : 'Local Guide Tip'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label={contentType === 'link' ? 'URL' : 'Content (Markdown supported)'}
            fullWidth
            multiline={contentType === 'markdown'}
            rows={contentType === 'markdown' ? 10 : 1}
            value={contentBody}
            onChange={(e) => setContentBody(e.target.value)}
          />
          
          {contentType === 'markdown' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Preview:</Typography>
              <Paper sx={{ p: 2, maxHeight: '300px', overflow: 'auto' }} className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {contentBody}
                </ReactMarkdown>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditContent(false)}>Cancel</Button>
          <Button onClick={handleEditContentSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this content? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteContent} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Password Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is a protected action. Please enter the administrator password to continue.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={verifyPassword} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{previewContent?.title}</DialogTitle>
        <DialogContent>
          {previewContent && previewContent.contentType === 'markdown' ? (
            <Paper sx={{ p: 2 }} className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {previewContent.content}
              </ReactMarkdown>
            </Paper>
          ) : previewContent && (
            <Box>
              <Typography variant="body1">
                External Link: <a href={previewContent.content} target="_blank" rel="noopener noreferrer">{previewContent.content}</a>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Rate Limit Snackbar */}
      <Snackbar
        open={retrySnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setRetrySnackbarOpen(false)}
        message="Rate limit detected. Retrying request automatically..."
      />
    </Box>
  );
}

export default GlbGuides;
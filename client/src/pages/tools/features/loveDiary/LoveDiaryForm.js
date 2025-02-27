import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material';

const MAX_IMAGE_SIZE = 800; // Maximum width/height in pixels
const COMPRESSION_QUALITY = 0.6; // Image quality (0.1 to 1.0)

const LoveDiaryForm = ({ onSubmit, onCancel, initialData, type }) => {
  // Set correct initial state based on initialData or type
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    image: null,
    // Be explicit about boolean conversion
    type: initialData ? initialData.type : type
  });
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_IMAGE_SIZE) {
              height = Math.round((height * MAX_IMAGE_SIZE) / width);
              width = MAX_IMAGE_SIZE;
            }
          } else {
            if (height > MAX_IMAGE_SIZE) {
              width = Math.round((width * MAX_IMAGE_SIZE) / height);
              height = MAX_IMAGE_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            },
            'image/jpeg',
            COMPRESSION_QUALITY
          );
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressedFile }));
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error processing image. Please try another one.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make sure type is explicitly set as a boolean
    const submitData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      type: initialData ? Boolean(initialData.type) : type
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {initialData 
          ? (initialData.type === 'big-event' ? 'Edit Big Event' : 'Edit Memory')
          : (type === 'big-event' ? 'Add Big Event' : 'Add Memory')
        }
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Summary"
            name="summary"
            multiline
            rows={1}
            value={formData.summary}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                {initialData?.image ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            {previewUrl && (
              <Box mt={2}>
                <Typography variant="caption" display="block" gutterBottom>
                  Preview:
                </Typography>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {initialData ? 'Save Changes' : (type === 'big-event' ? 'Add Big Event' : 'Add Memory')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default LoveDiaryForm;
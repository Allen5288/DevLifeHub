import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { format } from 'date-fns';

function ClassDialog({ open, onClose, onSave, event }) {
  const [formData, setFormData] = React.useState({
    subject: '',
    students: '',
    start: null,
    end: null,
    hourlyRate: 50,
    color: '#3788d8'
  });
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (event) {
      setFormData({
        subject: event.subject || '',
        students: event.students || '',
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
        hourlyRate: event.hourlyRate || 50,
        color: event.color || '#3788d8'
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.students.trim()) {
      newErrors.students = 'Students are required';
    }
    if (!formData.start) {
      newErrors.start = 'Start time is required';
    }
    if (!formData.end) {
      newErrors.end = 'End time is required';
    }
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    onSave({
      ...event,
      ...formData,
      subject: formData.subject.trim(),
      students: formData.students.trim(),
      start: formData.start.toISOString(),
      end: formData.end.toISOString(),
      hourlyRate: Number(formData.hourlyRate)
    });

    setFormData({
      subject: '',
      students: '',
      start: null,
      end: null,
      hourlyRate: 50,
      color: '#3788d8'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {event?.id ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Students (comma-separated)"
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={formData.start ? format(formData.start, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setFormData(prev => ({
                ...prev,
                start: date,
                end: prev.end || new Date(date.getTime() + 60 * 60 * 1000)
              }));
            }}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={formData.end ? format(formData.end, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setFormData(prev => ({
                ...prev,
                end: date
              }));
            }}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Hourly Rate ($)"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              hourlyRate: Number(e.target.value)
            }))}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: <span>$</span>
            }}
          />
          <Box mt={2}>
            <Button
              variant="outlined"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              {showColorPicker ? 'Close Color Picker' : 'Choose Color'}
            </Button>
            {showColorPicker && (
              <Box mt={2}>
                <ChromePicker
                  color={formData.color}
                  onChange={(color) => setFormData(prev => ({
                    ...prev,
                    color: color.hex
                  }))}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ClassDialog; 
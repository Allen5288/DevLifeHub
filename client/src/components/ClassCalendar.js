import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ClassDialog from './ClassDialog';

function ClassCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing classes
  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/classes`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSaveClass = async (eventData) => {
    try {
      if (!eventData.description) {
        setError('Description is required');
        return;
      }

      const classData = {
        description: eventData.description,
        start: eventData.start,
        end: eventData.end,
        color: eventData.color || '#3788d8'
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(classData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save class');
      }

      setEvents(prev => [...prev, data]);
      setOpenDialog(false);
      setError('');
    } catch (error) {
      console.error('Error saving class:', error);
      setError(error.message || 'Error saving class');
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (!user) {
      setError('Please log in to create classes');
      return;
    }

    setSelectedEvent({
      description: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: '#3788d8'
    });
    setOpenDialog(true);
  };

  return (
    <div className="calendar-container">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        height="auto"
      />

      <ClassDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedEvent(null);
          setError('');
        }}
        onSave={handleSaveClass}
        event={selectedEvent}
      />
    </div>
  );
}

export default ClassCalendar; 
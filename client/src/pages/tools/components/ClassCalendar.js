import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useAuth } from '../../../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

function ClassCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    students: '',
    subject: '',
    start: null,
    end: null,
    hourlyRate: 50
  });
  const [analytics, setAnalytics] = useState({
    totalHours: 0,
    totalEarnings: 0,
    studentHours: {},
    monthlyData: {}
  });
  const [error, setError] = useState('');

  const resetNewClass = useCallback(() => {
    setNewClass({
      subject: '',
      students: '',
      start: null,
      end: null,
      hourlyRate: 50
    });
  }, []);

  const calculateAnalytics = useCallback(() => {
    const analytics = events.reduce((acc, event) => {
      try {
        if (!event.start || !event.end) {
          console.warn('Invalid event data:', event);
          return acc;
        }

        const startDate = event.start instanceof Date ? event.start : new Date(event.start);
        const endDate = event.end instanceof Date ? event.end : new Date(event.end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn('Invalid date in event:', event);
          return acc;
        }

        const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const earnings = hours * event.hourlyRate;
        const month = format(startDate, 'MMMM yyyy');
        const students = event.students.split(',').map(s => s.trim());

        acc.totalHours += hours;
        acc.totalEarnings += earnings;

        acc.monthlyData[month] = acc.monthlyData[month] || { hours: 0, earnings: 0 };
        acc.monthlyData[month].hours += hours;
        acc.monthlyData[month].earnings += earnings;

        students.forEach(student => {
          acc.studentHours[student] = (acc.studentHours[student] || 0) + hours;
        });
      } catch (error) {
        console.error('Error processing event:', error, event);
      }
      return acc;
    }, {
      totalHours: 0,
      totalEarnings: 0,
      studentHours: {},
      monthlyData: {}
    });

    setAnalytics(analytics);
  }, [events]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    calculateAnalytics();
  }, [events, calculateAnalytics]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/classes', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Convert ISO strings to Date objects
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message || 'Error fetching events');
    }
  };

  const handleSelectSlot = ({ start }) => {
    setNewClass(prev => ({
      ...prev,
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000) // 1 hour default
    }));
    setOpenDialog(true);
  };

  const handleSaveClass = async () => {
    try {
      if (!newClass.subject || !newClass.students || !newClass.start || !newClass.end) {
        setError('Please fill in all required fields');
        return;
      }

      // Ensure dates are valid
      const start = new Date(newClass.start);
      const end = new Date(newClass.end);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError('Invalid date format');
        return;
      }

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          subject: newClass.subject,
          students: newClass.students,
          start: start.toISOString(),
          end: end.toISOString(),
          hourlyRate: newClass.hourlyRate || 50
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save class');
      }

      // Convert ISO strings back to Date objects for the calendar
      const formattedClass = {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end)
      };

      setEvents(prev => [...prev, formattedClass]);
      setOpenDialog(false);
      resetNewClass();
    } catch (error) {
      console.error('Error saving class:', error);
      setError(error.message || 'Error saving class');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(events.map(event => {
      const startDate = event.start instanceof Date ? event.start : new Date(event.start);
      const endDate = event.end instanceof Date ? event.end : new Date(event.end);
      
      return {
        Date: format(startDate, 'MM/dd/yyyy'),
        StartTime: format(startDate, 'HH:mm'),
        EndTime: format(endDate, 'HH:mm'),
        Students: event.students,
        Subject: event.subject,
        Hours: (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
        Earnings: ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) * event.hourlyRate
      };
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Classes');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'class_schedule.xlsx');
  };

  return (
    <div className="class-calendar">
      <Box className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </Box>

      <Box className="analytics-dashboard">
        <Typography variant="h5">Analytics Dashboard</Typography>
        <Box className="analytics-summary">
          <Typography>Total Hours: {analytics.totalHours.toFixed(2)}</Typography>
          <Typography>
            Total Earnings: ${analytics.totalEarnings.toFixed(2)}
          </Typography>
        </Box>

        <Box className="charts-container">
          <Box className="chart">
            <Bar
              data={{
                labels: Object.keys(analytics.monthlyData),
                datasets: [{
                  label: 'Monthly Hours',
                  data: Object.values(analytics.monthlyData).map(d => d.hours)
                }]
              }}
            />
          </Box>
          <Box className="chart">
            <Pie
              data={{
                labels: Object.keys(analytics.studentHours),
                datasets: [{
                  data: Object.values(analytics.studentHours)
                }]
              }}
            />
          </Box>
        </Box>

        <Button onClick={exportToExcel} variant="contained" color="primary">
          Export to Excel
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            value={newClass.subject}
            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Students (comma-separated)"
            value={newClass.students}
            onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={newClass.start ? format(newClass.start, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setNewClass(prev => ({
                ...prev,
                start: date,
                end: prev.end || new Date(date.getTime() + 60 * 60 * 1000)
              }));
            }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={newClass.end ? format(newClass.end, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setNewClass(prev => ({
                ...prev,
                end: date
              }));
            }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Hourly Rate ($)"
            type="number"
            value={newClass.hourlyRate}
            onChange={(e) => setNewClass(prev => ({
              ...prev,
              hourlyRate: Number(e.target.value)
            }))}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <span>$</span>
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            resetNewClass();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveClass} 
            color="primary"
            disabled={!newClass.subject || !newClass.students || !newClass.start || !newClass.end}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ClassCalendar; 
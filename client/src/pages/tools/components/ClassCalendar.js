import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './ClassCalendar.css'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Paper,
  Tooltip,
  IconButton,
  ButtonGroup,
  Select,
  MenuItem,
} from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Bar, Pie } from 'react-chartjs-2'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend, ArcElement } from 'chart.js'
import { useAuth } from '../../../context/AuthContext'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DownloadIcon from '@mui/icons-material/Download'
import { useNavigate } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, ArcElement)

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Styled components for the agenda
const EventWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  backgroundColor: '#f5f5f5',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#eeeeee',
    cursor: 'pointer',
  },
}))

const EventTime = styled('div')({
  fontSize: '0.85rem',
  color: '#666',
  fontWeight: 'bold',
})

const EventTitle = styled('div')({
  fontSize: '1rem',
  fontWeight: 'bold',
  marginBottom: '4px',
})

const EventDetails = styled('div')({
  fontSize: '0.85rem',
  color: '#666',
})

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
}))

const DateSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSelect-root': {
    minWidth: 120,
    backgroundColor: 'white',
  },
}))

const StyledCalendarContainer = styled(Box)(({ theme }) => ({
  background: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(3),
  '& .rbc-calendar': {
    fontFamily: theme.typography.fontFamily,
  },
}))

const StyledAnalyticsDashboard = styled(Box)(({ theme }) => ({
  background: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}))

const StyledChartContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: theme.spacing(3),
  margin: `${theme.spacing(3)} 0`,
}))

function ClassCalendar() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [newClass, setNewClass] = useState({
    subject: '',
    students: '',
    start: null,
    end: null,
    hourlyRate: 50,
  })
  const [analytics, setAnalytics] = useState({
    totalHours: 0,
    totalEarnings: 0,
    studentHours: {},
    monthlyData: {},
  })

  const [fetchError, setFetchError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [editingEvent, setEditingEvent] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const navigate = useNavigate()

  const clearErrors = useCallback(() => {
    setFetchError('')
    setSaveError('')
    setValidationError('')
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      clearErrors()
      const response = await fetch(`${process.env.REACT_APP_API_URL}/classes`, {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          const data = await response.json()
          if (data.message === 'No token provided' || data.message === 'Token expired') {
            navigate('/login')
            return
          }
        }
        throw new Error('Failed to fetch classes')
      }

      const data = await response.json()
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))

      setEvents(formattedEvents)
    } catch (error) {
      console.error('Error fetching classes:', error)
      setFetchError(error.message || 'Error fetching classes')
    }
  }, [clearErrors, navigate])

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user, fetchEvents])

  const calculateAnalytics = useCallback(() => {
    const filteredEvents = events.filter(event => {
      if (!startDate && !endDate) return true // Show all events if no date range selected
      const eventDate = new Date(event.start)
      const start = startDate ? new Date(startDate) : new Date('0001-01-01') // Default to earliest possible date if no start date
      const end = endDate ? new Date(endDate) : new Date('9999-12-31') // Default to latest possible date if no end date
      return eventDate >= start && eventDate <= end
    })

    const analytics = filteredEvents.reduce(
      (acc, event) => {
        try {
          if (!event.start || !event.end) {
            console.warn('Invalid event data:', event)
            return acc
          }

          const startDate = event.start instanceof Date ? event.start : new Date(event.start)
          const endDate = event.end instanceof Date ? event.end : new Date(event.end)

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('Invalid date in event:', event)
            return acc
          }

          const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
          const earnings = hours * event.hourlyRate
          const month = format(startDate, 'MMMM yyyy')
          const students = event.students.split(',').map(s => s.trim())

          acc.totalHours += hours
          acc.totalEarnings += earnings

          acc.monthlyData[month] = acc.monthlyData[month] || { hours: 0, earnings: 0 }
          acc.monthlyData[month].hours += hours
          acc.monthlyData[month].earnings += earnings

          students.forEach(student => {
            acc.studentHours[student] = (acc.studentHours[student] || 0) + hours
          })
        } catch (error) {
          console.error('Error processing event:', error, event)
        }
        return acc
      },
      {
        totalHours: 0,
        totalEarnings: 0,
        studentHours: {},
        monthlyData: {},
      }
    )

    setAnalytics(analytics)
  }, [events, startDate, endDate])

  useEffect(() => {
    calculateAnalytics()
  }, [events, calculateAnalytics, startDate, endDate])

  const handleSelectSlot = ({ start }) => {
    setNewClass(prev => ({
      ...prev,
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000), // 1 hour default
    }))
    setOpenDialog(true)
  }

  const handleDeleteClass = async eventId => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/classes/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete class')
      }

      setEvents(prev => prev.filter(event => event.id !== eventId))
    } catch (error) {
      console.error('Error deleting class:', error)
      setSaveError('Failed to delete class')
    }
  }

  const handleEditClass = event => {
    setEditingEvent(event)
    setNewClass({
      subject: event.subject,
      students: event.students,
      start: new Date(event.start),
      end: new Date(event.end),
      hourlyRate: event.hourlyRate,
    })
    setOpenDialog(true)
  }

  const handleSaveClass = async () => {
    try {
      clearErrors()

      // Validation
      if (!newClass.subject || !newClass.students || !newClass.start || !newClass.end) {
        setValidationError('Please fill in all required fields')
        return
      }

      // Date validation
      const start = new Date(newClass.start)
      const end = new Date(newClass.end)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setValidationError('Invalid date format')
        return
      }

      const method = editingEvent ? 'PUT' : 'POST'
      const url = editingEvent
        ? `${process.env.REACT_APP_API_URL}/classes/${editingEvent.id}`
        : `${process.env.REACT_APP_API_URL}/classes`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: newClass.subject,
          students: newClass.students,
          start: start.toISOString(),
          end: end.toISOString(),
          hourlyRate: newClass.hourlyRate || 50,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save class')
      }

      const formattedClass = {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      }

      setEvents(prev => {
        if (editingEvent) {
          return prev.map(event => (event.id === editingEvent.id ? formattedClass : event))
        }
        return [...prev, formattedClass]
      })

      setOpenDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error saving class:', error)
      setSaveError(error.message || 'Error saving class')
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      events.map(event => {
        const startDate = event.start instanceof Date ? event.start : new Date(event.start)
        const endDate = event.end instanceof Date ? event.end : new Date(event.end)

        return {
          Date: format(startDate, 'MM/dd/yyyy'),
          StartTime: format(startDate, 'HH:mm'),
          EndTime: format(endDate, 'HH:mm'),
          Students: event.students,
          Subject: event.subject,
          Hours: (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
          Earnings: ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) * event.hourlyRate,
        }
      })
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Classes')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([excelBuffer]), 'class_schedule.xlsx')
  }

  // Custom event component for agenda view
  const EventAgenda = ({ event }) => {
    const startTime = format(event.start, 'h:mm a')
    const endTime = format(event.end, 'h:mm a')
    const duration = (event.end - event.start) / (1000 * 60 * 60)

    return (
      <EventWrapper elevation={1}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <EventTime>
            {startTime} - {endTime}
          </EventTime>
          <Box>
            <IconButton size='small' onClick={() => handleEditClass(event)}>
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this class?')) {
                  handleDeleteClass(event.id)
                }
              }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>
        <EventTitle>{event.subject}</EventTitle>
        <EventDetails>
          <strong>Students:</strong> {event.students}
        </EventDetails>
        <EventDetails>
          <strong>Earnings:</strong> ${(duration * event.hourlyRate).toFixed(2)}
        </EventDetails>
      </EventWrapper>
    )
  }

  // Custom event component for calendar view
  const EventCalendar = ({ event }) => {
    return (
      <Tooltip
        title={
          <div>
            <div>
              <strong>Students:</strong> {event.students}
            </div>
            <div>
              <strong>Rate:</strong> ${event.hourlyRate}/hr
            </div>
            <div>
              <strong>Duration:</strong> {((event.end - event.start) / (1000 * 60 * 60)).toFixed(1)} hours
            </div>
          </div>
        }
        arrow
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#3788d8',
            color: 'white',
            padding: '2px 4px',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{event.subject}</div>
          <div style={{ fontSize: '0.85em' }}>{event.students}</div>
        </div>
      </Tooltip>
    )
  }

  const resetForm = () => {
    setNewClass({
      subject: '',
      students: '',
      start: null,
      end: null,
      hourlyRate: 50,
    })
    setEditingEvent(null)
  }

  const BarChartComponent = () => {
    const data = {
      labels: Object.keys(analytics.monthlyData),
      datasets: [
        {
          label: 'Hours',
          data: Object.values(analytics.monthlyData).map(d => d.hours),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'hours',
        },
        {
          label: 'Earnings',
          data: Object.values(analytics.monthlyData).map(d => d.earnings),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'earnings',
        },
      ],
    }

    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        hours: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Hours',
          },
        },
        earnings: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Earnings ($)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    }

    return <Bar data={data} options={options} />
  }

  const PieChartComponent = () => {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
    ]

    const data = {
      labels: Object.keys(analytics.studentHours),
      datasets: [
        {
          data: Object.values(analytics.studentHours),
          backgroundColor: colors.slice(0, Object.keys(analytics.studentHours).length),
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => {
              const label = context.label || ''
              const value = context.raw || 0
              const percentage = ((value / analytics.totalHours) * 100).toFixed(1)
              return `${label}: ${value.toFixed(1)} hours (${percentage}%)`
            },
          },
        },
        legend: {
          position: 'right',
          labels: {
            generateLabels: chart => {
              const data = chart.data
              return data.labels.map((label, i) => ({
                text: `${label} (${data.datasets[0].data[i].toFixed(1)}h)`,
                fillStyle: colors[i],
                hidden: false,
                index: i,
              }))
            },
          },
        },
      },
    }

    return <Pie data={data} options={options} />
  }

  const CustomToolbar = toolbar => {
    const currentDate = toolbar.date
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const handleMonthChange = event => {
      const newMonth = event.target.value
      const newDate = new Date(currentYear, newMonth, 1)
      toolbar.onNavigate('DATE', newDate)
    }

    const handleYearChange = event => {
      const newYear = event.target.value
      const newDate = new Date(newYear, currentMonth, 1)
      toolbar.onNavigate('DATE', newDate)
    }

    const handleViewChange = view => {
      // Ensure date is first of month when switching to month view
      if (view === 'month') {
        const newDate = new Date(currentYear, currentMonth, 1)
        toolbar.onNavigate('DATE', newDate)
      }
      toolbar.onView(view.toLowerCase())
    }

    const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    return (
      <ToolbarWrapper>
        <ButtonGroup size='small' variant='outlined'>
          <IconButton onClick={() => toolbar.onNavigate('PREV')}>
            <ChevronLeftIcon />
          </IconButton>
          <Button
            onClick={() => {
              const today = new Date()
              toolbar.onNavigate('DATE', today)
            }}
          >
            Today
          </Button>
          <IconButton onClick={() => toolbar.onNavigate('NEXT')}>
            <ChevronRightIcon />
          </IconButton>
        </ButtonGroup>

        <DateSelector>
          <Select value={currentMonth} onChange={handleMonthChange} size='small' variant='outlined'>
            {months.map((month, idx) => (
              <MenuItem key={month} value={idx}>
                {month}
              </MenuItem>
            ))}
          </Select>

          <Select value={currentYear} onChange={handleYearChange} size='small' variant='outlined'>
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </DateSelector>

        <ButtonGroup size='small' variant='outlined'>
          {['Month', 'Week', 'Day', 'Agenda'].map(view => (
            <Button
              key={view}
              onClick={() => handleViewChange(view.toLowerCase())}
              variant={toolbar.view === view.toLowerCase() ? 'contained' : 'outlined'}
            >
              {view}
            </Button>
          ))}
        </ButtonGroup>
      </ToolbarWrapper>
    )
  }

  return (
    <div className='class-calendar'>
      {/* Error displays */}
      <Box sx={{ mb: 2 }}>
        {fetchError && (
          <Alert severity='error' onClose={() => setFetchError('')}>
            {fetchError}
          </Alert>
        )}
        {saveError && (
          <Alert severity='error' onClose={() => setSaveError('')}>
            {saveError}
          </Alert>
        )}
        {validationError && (
          <Alert severity='warning' onClose={() => setValidationError('')}>
            {validationError}
          </Alert>
        )}
      </Box>

      <StyledCalendarContainer>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 700 }}
          onSelectSlot={handleSelectSlot}
          selectable
          components={{
            toolbar: CustomToolbar,
            agenda: {
              event: EventAgenda,
            },
            event: EventCalendar,
          }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView='month'
          popup
          onNavigate={(newDate, view, action) => {
            // Handle date navigation consistently across views
            const date = new Date(newDate)
            if (action === 'PREV') {
              switch (view) {
                case 'month':
                  date.setMonth(date.getMonth() - 1)
                  break
                case 'week':
                  date.setDate(date.getDate() - 7)
                  break
                case 'day':
                  date.setDate(date.getDate() - 1)
                  break
                case 'agenda':
                  date.setMonth(date.getMonth() - 1)
                  break
                default:
                  break
              }
            } else if (action === 'NEXT') {
              switch (view) {
                case 'month':
                  date.setMonth(date.getMonth() + 1)
                  break
                case 'week':
                  date.setDate(date.getDate() + 7)
                  break
                case 'day':
                  date.setDate(date.getDate() + 1)
                  break
                case 'agenda':
                  date.setMonth(date.getMonth() + 1)
                  break
                default:
                  break
              }
            }
          }}
          formats={{
            monthHeaderFormat: 'MMMM yyyy',
            agendaDateFormat: 'MMMM do, yyyy',
            agendaTimeFormat: 'h:mm a',
            agendaTimeRangeFormat: ({ start, end }) => {
              return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
            },
            dayRangeHeaderFormat: ({ start, end }) => {
              const startStr = format(start, 'MMM do')
              const endStr = format(end, 'MMM do, yyyy')
              return `${startStr} - ${endStr}`
            },
          }}
          messages={{
            noEventsInRange: 'No classes scheduled',
            allDay: 'All day',
          }}
        />
      </StyledCalendarContainer>

      <StyledAnalyticsDashboard>
        <Typography variant='h5' sx={{ mb: 3 }}>
          Analytics Dashboard
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label='Start Date' value={startDate} onChange={newValue => setStartDate(newValue)} />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label='Start Date' value={endDate} onChange={newValue => setEndDate(newValue)} />
            </DemoContainer>
          </LocalizationProvider>
          <Button variant='contained' color='primary' onClick={calculateAnalytics}>
            Apply Date Filter
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setStartDate(null)
              setEndDate(null)
            }}
          >
            Clear Date Filter
          </Button>
        </Box>

        <Box className='analytics-summary'>
          <Typography>Total Hours: {analytics.totalHours.toFixed(2)}</Typography>
          <Typography>
            Total Earnings: ${analytics.totalEarnings.toFixed(2)} (RMB: {analytics.totalEarnings.toFixed(2) * 5})
          </Typography>
        </Box>

        <StyledChartContainer>
          <Box className='chart'>
            <BarChartComponent />
          </Box>
          <Box className='chart'>
            <PieChartComponent />
          </Box>
        </StyledChartContainer>

        <Button onClick={exportToExcel} variant='contained' color='primary' startIcon={<DownloadIcon />} sx={{ mt: 2 }}>
          Export to Excel
        </Button>
      </StyledAnalyticsDashboard>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          clearErrors()
          resetForm()
        }}
      >
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <TextField
            label='Subject'
            value={newClass.subject}
            onChange={e => setNewClass({ ...newClass, subject: e.target.value })}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Students (comma-separated)'
            value={newClass.students}
            onChange={e => setNewClass({ ...newClass, students: e.target.value })}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Start Time'
            type='datetime-local'
            value={newClass.start ? format(newClass.start, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={e => {
              const date = new Date(e.target.value)
              setNewClass(prev => ({
                ...prev,
                start: date,
                end: prev.end || new Date(date.getTime() + 60 * 60 * 1000),
              }))
            }}
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label='End Time'
            type='datetime-local'
            value={newClass.end ? format(newClass.end, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={e => {
              const date = new Date(e.target.value)
              setNewClass(prev => ({
                ...prev,
                end: date,
              }))
            }}
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label='Hourly Rate ($)'
            type='number'
            value={newClass.hourlyRate}
            onChange={e =>
              setNewClass(prev => ({
                ...prev,
                hourlyRate: Number(e.target.value),
              }))
            }
            fullWidth
            margin='normal'
            InputProps={{
              startAdornment: <span>$</span>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false)
              clearErrors()
              resetForm()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClass}
            color='primary'
            disabled={!newClass.subject || !newClass.students || !newClass.start || !newClass.end}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ClassCalendar

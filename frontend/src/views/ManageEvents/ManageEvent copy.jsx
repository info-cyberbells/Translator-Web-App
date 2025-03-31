import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const handleOpen = () => {
    setEventName('');
    setEventDate('');
    setError('');
    setSuccess(false);
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (event) => {
    setEventName(event.name);
    setEventDate(event.date);
    setEditMode(true);
    setCurrentEventId(event.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error and success state
    setError('');
    setSuccess(false);

    // Basic validation checks
    if (!eventName.trim()) {
      setError('Event name is required.');
      return;
    }

    if (!eventDate.trim()) {
      setError('Event date is required.');
      return;
    }

    if (eventName.length < 3) {
      setError('Event name must be at least 3 characters long.');
      return;
    }

    // If in edit mode, update the event
    if (editMode) {
      setEvents(events.map((event) =>
        event.id === currentEventId
          ? { ...event, name: eventName, date: eventDate }
          : event
      ));
      setSuccess(true);
      handleClose();
      return;
    }

    // Add new event
    const newEvent = {
      id: events.length + 1,
      name: eventName,
      date: eventDate,
    };
    setEvents([...events, newEvent]);
    setSuccess(true);
    handleClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Card sx={{ mb: 3, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Events List
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Event
          </Button>
        </CardContent>
      </Card>

      {events.map((event) => (
        <Card key={event.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{event.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {event.date}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleEdit(event)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(event.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      {/* Modal for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Event Name"
                variant="outlined"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                error={!!error && error.includes('Event name')}
                helperText={error.includes('Event name') ? error : ''}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Event Date"
                variant="outlined"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!error && error.includes('Event date')}
                helperText={error.includes('Event date') ? error : ''}
              />
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Event has been submitted successfully!
              </Alert>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update Event' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events;

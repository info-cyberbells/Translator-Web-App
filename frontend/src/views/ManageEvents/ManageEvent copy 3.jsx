import React, { useState, useEffect } from 'react';
import { Grid, Card, Table, Button, Dialog, DialogTitle, DialogContent, TableContainer, Paper, DialogActions, TextField, Typography } from '@mui/material';
import axios from 'axios';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Event = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const churchId = localStorage.getItem('churchId');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Updated date formatting function
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Return empty string if date is invalid
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  // Updated function to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Return empty string if date is invalid
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const isDateBeforeCurrent = (dateString) => {
    if (!dateString) return false;
    try {
      const eventDate = new Date(dateString);
      if (isNaN(eventDate.getTime())) return false; // Return false if date is invalid
      eventDate.setHours(0, 0, 0, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return eventDate < currentDate;
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/event/fetchAll/${churchId}`);
      // Ensure dates are properly formatted when setting state
      const formattedUsers = response.data.map(user => ({
        ...user,
        date: user.date ? new Date(user.date).toISOString() : null
      }));
      setUsers(formattedUsers);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching Events");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        await axios.delete(`${apiBaseUrl}/event/delete/${id}`);
        setUsers(users.filter(user => user._id !== id));
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error deleting Event");
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    setCurrentUser({ 
      churchId,
      date: formatDateForInput(new Date()) // Set default date to today
    });
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const handleEdit = (user) => {
    setModalType('Update');
    const formattedUser = {
      ...user,
      date: formatDateForInput(user.date),
      churchId
    };
    setCurrentUser(formattedUser);
    setShowModal(true);
    setError(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!currentUser.name || currentUser.name.trim() === '') {
      errors.name = "Event Name is required.";
    }

    if (!currentUser.date) {
      errors.date = "Event Date is required.";
    } else {
      // Validate date format
      const date = new Date(currentUser.date);
      if (isNaN(date.getTime())) {
        errors.date = "Invalid date format";
      }
    }
    
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const eventData = {
        ...currentUser,
        churchId,
        date: new Date(currentUser.date).toISOString() // Format date for API
      };

      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/event/add`, eventData);
        if (response.data) {
          setUsers([...users, response.data]);
          toast.success("Event saved successfully");
    fetchUsers();

        }
      } else {
        const response = await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, eventData);
        if (response.data) {
          setUsers(users.map(user => user._id === currentUser._id ? response.data : user));
          toast.success("Event updated successfully");
    fetchUsers();

        }
      }

      setShowModal(false);
      setCurrentUser({});
      setValidationErrors({});
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || `Error during ${modalType.toLowerCase()} operation`;
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentUser(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" className="bg-b" onClick={handleAdd}>
                Add New Event
              </Button>
            </div>
            <TableContainer component={Paper} style={{ overflowX: 'auto', padding: '50px' }}>
              <Table>
                <thead>
                  <tr>
                    <th style={{ padding: '10px' }}>Sr. No</th>
                    <th style={{ padding: '25px' }}>Event Name</th>
                    <th style={{ padding: '25px' }}>Event Date</th>
                    <th style={{ padding: '25px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => {
                      const isDisabled = isDateBeforeCurrent(user.date);
                      return (
                        <tr 
                          key={user._id} 
                          style={{ 
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                            opacity: isDisabled ? 0.5 : 1,
                            pointerEvents: isDisabled ? 'none' : 'auto'
                          }}
                        >
                          <td>{index + 1}</td>
                          <td style={{ padding: '25px' }}>{user.name}</td>
                          <td style={{ padding: '25px' }}>
                            {formatDateForDisplay(user.date)}
                          </td>
                          <td>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              className="bg-b"
                              onClick={() => handleEdit(user)}
                              disabled={isDisabled}
                              sx={{
                                // Add these styles to maintain visibility when disabled
                                opacity: '1 !important',
                                backgroundColor: isDisabled ? '#4CAF50' : undefined, // Keep green color
                                '&.Mui-disabled': {
                                  backgroundColor: '#4CAF50',
                                  opacity: '0.7 !important',
                                  color: 'white'
                                }
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small" 
                              className="bg-b"
                              onClick={() => handleDelete(user._id)}
                              disabled={isDisabled}
                              sx={{
                                marginLeft: '8px',
                                opacity: '1 !important',
                                backgroundColor: isDisabled ? '#ef5350' : undefined, // Keep red color
                                '&.Mui-disabled': {
                                  backgroundColor: '#ef5350',
                                  opacity: '0.7 !important',
                                  color: 'white'
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>No Event available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{modalType === 'Save' ? 'Add Event' : 'Edit Event'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#231f20',
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20',
                },
              }}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              label="Event Date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#231f20',
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20',
                },
              }}
              error={!!validationErrors.date}
              helperText={validationErrors.date}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={currentUser.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#231f20',
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20',
                },
              }}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
            {error && <Typography color="error">{error}</Typography>}
            <DialogActions>
              <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" className="bg-b">
                {modalType}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Event;
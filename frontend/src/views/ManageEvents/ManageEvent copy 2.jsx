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
  console.log(churchId)
  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to check if date is before current date
  const isDateBeforeCurrent = (dateString) => {
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return eventDate < currentDate;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/event/fetchAll/${churchId}`);
      
      const responseList = response.data;
      setUsers(responseList);
    } catch (err) {
      toast.error(err.message || "Error fetching Events");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        await axios.delete(`${apiBaseUrl}/event/delete/${id}`);
        setUsers(users.filter(user => user._id !== id));
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error(err.message || "Error deleting Event");
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    setCurrentUser({});
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const handleEdit = (user) => {
    setModalType('Update');
    const formattedUser = {
      ...user,
      date: user.date ? new Date(user.date).toISOString().split('T')[0] : ''
    };
    setCurrentUser(formattedUser);
    setShowModal(true);
    setError(null);
  };

  const validateForm = () => {
    const errors = {};
    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    const whitespaceRegex = /^\s*$/;

    if (!currentUser.name) {
      errors.name = "Event Name is required.";
    } else if (specialCharRegex.test(currentUser.name) || whitespaceRegex.test(currentUser.name)) {
      errors.name = "Event name must not contain special characters or be empty.";
    }

    if (!currentUser.date) {
      errors.date = "Event Date is required.";
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
      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/event/add`, currentUser);
        setUsers([...users, { ...currentUser, _id: response.data._id }]);
        toast.success("Event is saved successfully");
      } else {
        await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, currentUser);
        setUsers(users.map(user => user._id === currentUser._id ? currentUser : user));
        toast.success("Event is updated successfully");
        fetchUsers();
      }

      setShowModal(false);
      setCurrentUser({});
      setValidationErrors({});
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
      }
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
                            {new Date(user.date).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              className="bg-b"
                              onClick={() => handleEdit(user)}
                              disabled={isDisabled}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small" 
                              className="bg-b"
                              onClick={() => handleDelete(user._id)}
                              style={{ marginLeft: '8px' }}
                              disabled={isDisabled}
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
                  color: '#231f20', // default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20', // label color when focused
                },
              }}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
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
                  color: '#231f20', // default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20', // label color when focused
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
                  color: '#231f20', // default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20', // label color when focused
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
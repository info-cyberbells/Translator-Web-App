import React, { useState, useEffect } from 'react';
import { Grid, Card, Table, Button, Dialog, DialogTitle, DialogContent, TableContainer, Paper, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import axios from 'axios';
import './style.css'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [churches, setChurches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'Add' or 'Edit'
  const [currentUser, setCurrentUser] = useState({}); // To hold data of user being edited
  const [validationErrors, setValidationErrors] = useState({}); // To hold validation errors

    
  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);
        const filteredUsers = response.data.filter(user => user.type === "2");
        setUsers(filteredUsers);
      } catch (err) {
        setError(err.message || "Error fetching Administrators"); // Handle any errors
      }
    };

    // Fetch church names
    const fetchChurches = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
        setChurches(response.data); // Assuming the response is an array of church names
      } catch (err) {
        setError(err.message || "Error fetching churches");
      }
    };

    fetchUsers();
    fetchChurches();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Administrator?")) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        setUsers(users.filter(user => user._id !== id));
        window.alert("Administrator deleted successfully");
      } catch (err) {
        setError(err.message || "Error deleting Administrator");
      }
    }
  };

  // Handle Add Button Click
  const handleAdd = () => {
    setModalType('Save');
    setCurrentUser({
      type: '2'  // Default user type to 2 for Administrators
    }); 
    setShowModal(true);
    setError(null);  // Clear previous errors
    setValidationErrors({});  // Clear previous validation errors
  };

  // Handle Edit Button Click
  const handleEdit = (user) => {
    setModalType('Update');
    setCurrentUser({
      ...user,
      churchId: user.churchId?._id || ''  // Ensure churchId is populated
    });
    setShowModal(true);
    setError(null);  // Clear previous errors
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    const specialCharRegex = /[^a-zA-Z0-9\s]/; // Regex to match special characters
    const whitespaceRegex = /^\s*$/; // Regex to match whitespace
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to match valid email format

    if (!currentUser.firstName) {
        errors.firstName = "First name is required.";
    } else if (specialCharRegex.test(currentUser.firstName) || whitespaceRegex.test(currentUser.firstName)) {
        errors.firstName = "First name must not contain special characters or be empty.";
    }

    if (!currentUser.lastName) {
        errors.lastName = "Last name is required.";
    } else if (specialCharRegex.test(currentUser.lastName) || whitespaceRegex.test(currentUser.lastName)) {
        errors.lastName = "Last name must not contain special characters or be empty.";
    }

    if (!currentUser.email) {
        errors.email = "Email is required.";
    } else if (!emailRegex.test(currentUser.email)) {
        errors.email = "Email format is invalid.";
    }

    if (!currentUser.phone) {
        errors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(currentUser.phone)) {
        errors.phone = "Phone number must be exactly 10 digits.";
    }
    if (modalType === 'Save' && !currentUser.password) {
      errors.password = "Password is required.";
    }

    if (!currentUser.suburb) {
        errors.suburb = "Suburb is required.";
    } else if (specialCharRegex.test(currentUser.suburb) || whitespaceRegex.test(currentUser.suburb)) {
        errors.suburb = "Suburb must not contain special characters or be empty.";
    }

    if (!currentUser.churchId) {
        errors.churchId = "Church Name is required.";
    }
    
    return errors;
};


  // Handle form submission for both Add and Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors if any
      return;
    }

    try {
      const userToSave = { ...currentUser, type: '2' };  // Ensure user type is 2

      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        setUsers([...users, { ...userToSave, _id: response.data._id }]); // Add to users state
        window.alert("Administrator added successfully");
      } else {
        await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        setUsers(users.map(user => user._id === currentUser._id ? userToSave : user)); // Update in users state
        window.alert("Administrator updated successfully");
      }
      setShowModal(false);
      setCurrentUser({});
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Set the specific API error message
      } else {
        setError(err.message || `Error during ${modalType.toLowerCase()} operation`);
      }
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setCurrentUser(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add New Administrator
              </Button>
            </div>
            <div>

              <TableContainer component={Paper} style={{ overflowX: 'auto', padding: '50px'
               }}>
                <Table>
                  <thead>
                    <tr >
                      <th style={{ padding: '10px' }}>Sr. No</th>
                      <th style={{ padding: '25px' }}>First Name</th>
                      <th style={{ padding: '25px' }}>Last Name</th>
                      <th style={{ padding: '25px' }}>Email</th>
                      <th style={{ padding: '25px' }}>Phone</th>
                      <th style={{ padding: '25px' }}>Suburb</th>
                      <th style={{ padding: '25px' }}>Church Name</th>
                      <th style={{ padding: '25px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody >
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                          <td>{index + 1}</td>  
                          <td style={{ padding: '25px' }}>{user.firstName}</td>
                          <td style={{ padding: '25px' }}>{user.lastName}</td>
                          <td style={{ padding: '25px' }}>{user.email}</td>
                          <td style={{ padding: '25px' }}>{user.phone}</td>
                          
                          <td style={{ padding: '25px' }}>{user.suburb}</td>
                          <td style={{ padding: '25px' }}>{user.churchId?.name || 'N/A'}</td>
                          <td>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small" 
                              onClick={() => handleDelete(user._id)}
                              style={{ marginLeft: '8px' }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>No Administrator available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableContainer>
            </div>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Add/Edit */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>{modalType === 'Save' ? 'Add Administrator' : 'Edit Administrator'}</DialogTitle>
        {/* <DialogTitle>{modalType} Administrator</DialogTitle> */}
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
            />
             <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            {modalType === 'Save' && (
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={currentUser.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
            )}
           
             {error && <Typography color="error">{error}</Typography>}
            <FormControl fullWidth margin="normal" error={!!validationErrors.churchId}>
              <InputLabel id="church-label">Church Name</InputLabel>
              <Select
              labelId="church-label"
                value={currentUser.churchId || ''}
                onChange={(e) => handleInputChange('churchId', e.target.value)}
              >
                <MenuItem value=""><em>Select Church</em></MenuItem>
                {churches.map((church) => (
                  <MenuItem key={church._id} value={church._id}>{church.name}</MenuItem>
                ))}
              </Select>
              {validationErrors.churchId && <Typography color="error"  fontSize="0.75rem" style={{marginleft: '14px'}}>{validationErrors.churchId}</Typography>}
            </FormControl>
             <TextField
              label="Suburb"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.suburb || ''}
              onChange={(e) => handleInputChange('suburb', e.target.value)}
              error={!!validationErrors.suburb}
              helperText={validationErrors.suburb}
            />
           
            <DialogActions>
            <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {modalType}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Administrator;

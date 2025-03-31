import React, { useState, useEffect } from 'react';
import { Grid, Card, Table, Button, Dialog, DialogTitle, DialogContent, TableContainer, Paper, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [churches, setChurches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'Add' or 'Edit'
  const [currentUser, setCurrentUser] = useState({}); // To hold data of user being edited
  const [validationErrors, setValidationErrors] = useState({}); // To hold validation errors

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchChurches();
   
    };

    fetchData();
  }, []);
  // Fetch users from the API
  // useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get userType and churchId from localStorage
        const userType = localStorage.getItem('userType');
        const churchId = localStorage.getItem('churchId');
    
        // Fetch users data from the API
        const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);
    
        // Filter users based on userType
        const filteredUsers = response.data.filter(user => {
          if (userType === "1") {
            // If userType is 1, filter by type without considering churchId
            return user.type === "4";
          } else {
            // Otherwise, filter by both type and churchId
            return user.type === "4" && user.churchId?._id === churchId;
          }
        });
    
        console.log('Filtered users:', filteredUsers);
    
        // Set the filtered users
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error(err.message || "Error fetching churches");
        // setError(err.message || "Error fetching Staff members");
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

  //   fetchUsers();
  //   fetchChurches();
  // }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this User?")) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        setUsers(users.filter(user => user._id !== id));
        toast.success("User deleted successfully");
        // window.alert("User deleted successfully");
      } catch (err) {
        toast.error(err.message || "Error deleting User");
      }
    }
  };

  // Handle Add Button Click
  const handleAdd = () => {
    setModalType('Save');
    const userType = localStorage.getItem('userType'); // Retrieve user type from localStorage
    setCurrentUser({
      type: userType === '2' ? '2' : '4' // Default user type based on localStorage
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

    if (!currentUser.suburb) {
        errors.suburb = "Suburb is required.";
    } else if (specialCharRegex.test(currentUser.suburb) || whitespaceRegex.test(currentUser.suburb)) {
        errors.suburb = "Suburb must not contain special characters or be empty.";
    }

    // if (!currentUser.churchId) {
    //     errors.churchId = "Church Name is required.";
    // }
    
    return errors;
};


  // Handle form submission for both Add and Edit
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors); // Set validation errors if any
  //     return;
  //   }

  //   try {
  //     const userToSave = { ...currentUser, type: '4' };  // Ensure user type is 2

  //     if (modalType === 'Save') {
  //       const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
  //       setUsers([...users, { ...userToSave, _id: response.data._id }]); // Add to users state
  //       window.alert("User added successfully");
  //     } else {
  //       await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
  //       setUsers(users.map(user => user._id === currentUser._id ? userToSave : user)); // Update in users state
  //       window.alert("User updated successfully");
  //     }
  //     setShowModal(false);
  //     setCurrentUser({});
  //   } catch (err) {
  //     if (err.response && err.response.data && err.response.data.error) {
  //       setError(err.response.data.error); // Set the specific API error message
  //     } else {
  //       setError(err.message || `Error during ${modalType.toLowerCase()} operation`);
  //     }
  //   }
  // };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors if any
      return;
    }
  
    try {
      // Create a copy of currentUser
      const userToSave = { ...currentUser, type: '4' };
  
      // Remove churchId if it's an empty string
      if (userType === '2' || userType === '3' || !userToSave.churchId) {
        delete userToSave.churchId;
      }
  
      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        setUsers([...users, { ...userToSave, _id: response.data._id }]); // Add to users state
        toast.success("User added successfully");
        setValidationErrors({});
        setCurrentUser({});
        setShowModal(false);
        // fetchUsers();

        // window.alert("User added successfully");
      } else {
        await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        setUsers(users.map(user => user._id === currentUser._id ? { ...userToSave, _id: currentUser._id } : user)); // Update in users state
        // window.alert("User updated successfully");
        toast.success("User updated successfully");
       
        fetchUsers();
      }
      setValidationErrors({});
      setCurrentUser({});
      setShowModal(false);
    } 
    catch (err) 
    {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error)
        // setError(err.response.data.error); // Set the specific API error message
      } else {
        toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
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
  const userType = localStorage.getItem('userType'); // Define userType variable here

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
                Add New User
              </Button>
            </div>
            <div >
             
              <TableContainer component={Paper} style={{ overflowX: 'auto', padding: '10px' }}>
                <Table>
                  <thead>
                    <tr>
                      {/* <th>Sr. No</th> */}
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Suburb</th>
                      <th>Church Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                          {/* <td>{index + 1}</td>   */}
                          <td style={{ padding: '20px' }}>{user.firstName}</td>
                          <td style={{ padding: '20px' }}>{user.lastName}</td>
                          <td style={{ padding: '20px' }}>{user.phone}</td>
                          <td style={{ padding: '20px' }}>{user.email}</td>
                          <td style={{ padding: '20px' }}>{user.suburb}</td>
                          <td style={{ padding: '20px' }}>{user.churchId?.name || 'N/A'}</td>
                          <td>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" className="bg-b"
                              onClick={() => handleEdit(user)} style={{marginBottom: '3px',fontSize: '11px'}}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small" 
                              className="bg-b"
                              onClick={() => handleDelete(user._id)}
                              style={{ marginLeft: '2px', marginBottom: '3px',fontSize: '11px' }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>No User available</td>
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
        <DialogTitle>{modalType} User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
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
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
             {error && <Typography color="error">{error}</Typography>}
             <TextField
  label="Suburb"
  variant="outlined"
  fullWidth
  margin="normal"
  value={currentUser.suburb || ''}
  onChange={(e) => handleInputChange('suburb', e.target.value)}
  error={!!validationErrors.suburb}
  helperText={validationErrors.suburb}
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
/>

{userType !== '2' && userType !== '3' && (
  <FormControl
    fullWidth
    margin="normal"
    error={!!validationErrors.churchId}
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
  >
    <InputLabel id="formChurchId-label">Church Name</InputLabel>
    <Select
      labelId="formChurchId-label"
      label="Church Name"
      value={currentUser.churchId || ''}
      onChange={(e) => handleInputChange('churchId', e.target.value)}
    >
      <MenuItem value="">
        <em>Select Church</em>
      </MenuItem>
      {churches.map((church) => (
        <MenuItem key={church._id} value={church._id}>
          {church.name}
        </MenuItem>
      ))}
    </Select>
    {validationErrors.churchId && (
      <Typography color="error" sx={{ fontSize: '0.75rem', marginLeft: '14px' }}>
        {validationErrors.churchId}
      </Typography>
    )}
  </FormControl>
)}


            <DialogActions>
            <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="bg-b" color="primary">
                {modalType}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default User;

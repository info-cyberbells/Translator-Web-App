import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  Table, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TableContainer, 
  Paper, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const User = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [churches, setChurches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchChurches();
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const userType = localStorage.getItem('userType');
      const churchId = localStorage.getItem('churchId');
      const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);

      const filteredUsers = response.data.filter(user => {
        if (userType === "1") {
          return user.type === "4";
        } else if (userType === "2") {
          return user.type === "4" && (!user.churchId || user.churchId?._id === churchId);
        } else {
          return user.type === "4" && user.churchId?._id === churchId;
        }
      }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error(err.message || "Error fetching users");
    }
  };

  const fetchChurches = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
      setChurches(response.data);
    } catch (err) {
      toast.error(err.message || "Error fetching churches");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this User?")) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        await fetchUsers(); // Refetch the list after deletion
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err.message || "Error deleting User");
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    const userType = localStorage.getItem('userType');
    setCurrentUser({
      type: userType === '2' ? '2' : '4'
    });
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const handleEdit = (user) => {
    setModalType('Update');
    setCurrentUser({
      ...user,
      churchId: user.churchId?._id || ''
    });
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[^a-zA-Z\s]/; // Define the special character regex
    const whitespaceRegex = /^\s*$/; // Regex to match whitespace
    
    // First Name validation
    if (!currentUser.firstName?.trim()) {
      errors.firstName = "First name is required.";
    } else if (specialCharRegex.test(currentUser.firstName)) {
      errors.firstName = "First name should only contain letters.";
    }

    // Last Name validation
   // Last Name validation - Optional but validate if provided
   if (currentUser.lastName && currentUser.lastName.trim() && specialCharRegex.test(currentUser.lastName)) {
    errors.lastName = "Last name should only contain letters.";
  }


    // Email validation
    if (!currentUser.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(currentUser.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone validation
    if (!currentUser.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(currentUser.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    // Suburb validation
    if (!currentUser.suburb?.trim()) {
      errors.suburb = "Suburb is required.";
    } else if (specialCharRegex.test(currentUser.suburb)) {
      errors.suburb = "Suburb should only contain letters.";
    }
    
    if (!currentUser.churchId) {
      errors.churchId = "Church Name is required.";
  }
    // Church validation for admin users
    const userType = localStorage.getItem('userType');
    if (userType === '1' && !currentUser.churchId) {
      errors.churchId = "Please select a church.";
    }

    return errors;
};


  const handleInputChange = (field, value) => {
    // Update the current user state
    setCurrentUser(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear the specific field error when the user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors);
  //     return;
  //   }

  //   try {
  //     const userToSave = { ...currentUser, type: '4' };

  //     if (!userToSave.churchId || userToSave.churchId === '') {
  //       delete userToSave.churchId;
  //     }

  //     if (modalType === 'Save') {
  //       await axios.post(`${apiBaseUrl}/user/add`, userToSave);
  //       await fetchUsers();
  //       toast.success("User added successfully");
  //     } else {
  //       if (userToSave.churchId === '') {
  //         userToSave.churchId = null;
  //       }
  //       await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
  //       await fetchUsers();
  //       toast.success("User updated successfully");
  //     }

  //     setValidationErrors({});
  //     setError(null);
  //     setCurrentUser({});
  //     setShowModal(false);
  //   } catch (err) {
  //     const apiError = err.response?.data?.error || err.message || `Error during ${modalType.toLowerCase()} operation`;
  //     setError(apiError);
  //     toast.error(apiError);
  //   }
  // };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Get the church ID from localStorage if userType is 2 or 3
      const userType = localStorage.getItem('userType');
      const churchIdFromStorage = localStorage.getItem('churchId');

      const userToSave = {
        ...currentUser,
        type: '4', // Set user type to 4
        // Set churchId based on user type
        churchId: userType === '2' || userType === '3'
          ? churchIdFromStorage
          : (currentUser.churchId || null)
      };

      // Remove churchId if it's empty
      if (!userToSave.churchId) {
        delete userToSave.churchId;
      }

      // Add password validation for new user
      if (modalType === 'Save' && !userToSave.password) {
        userToSave.password = Math.random().toString(36).slice(-8); // Generate random password
      }

      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        if (response.data) {
          await fetchUsers(); // Refresh the list
          toast.success("User added successfully");
          // if (userToSave.password) {
          //   toast.info(`Temporary password: ${userToSave.password}`); // Show generated password
          // }
        }
      } else {
        // For update, remove password if not changed
        if (userToSave.password === undefined) {
          delete userToSave.password;
        }
        const response = await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        if (response.data) {
          await fetchUsers(); // Refresh the list
          toast.success("User updated successfully");
        }
      }

      setValidationErrors({});
      setError(null);
      setCurrentUser({});
      setShowModal(false);
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(apiError);
      toast.error(apiError || `Error during ${modalType.toLowerCase()} operation`);
      console.error('Error details:', err);
    }
  };

  const userType = localStorage.getItem('userType'); // Define userType variable here

  return (
    <React.Fragment>
        <ToastContainer />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              {/* Add Button Container */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                p: { xs: 1, sm: 2 }
              }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="bg-b"
                  onClick={handleAdd}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    mb: { xs: 2, sm: 0 }
                  }}
                >
                  Add New User
                </Button>
              </Box>
  
              {/* Table Container */}
              <TableContainer 
                component={Paper} 
                sx={{ 
                  overflowX: 'auto',
                  p: { xs: 1, sm: 2, md: 3 }
                }}
              >
                <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                  <thead>
                    <tr>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}>Sr. No</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>First Name</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Last Name</th>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}>Email</th>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}>Phone</th>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isTablet ? 'none' : 'table-cell'
                      }}>Suburb</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Church Name</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}>{index + 1}</td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.firstName}</td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.lastName}</td>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}>{user.email}</td>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}>{user.phone}</td>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isTablet ? 'none' : 'table-cell'
                          }}>{user.suburb}</td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>
                            {user.churchId?.name || 'N/A'}
                          </td>
                          <td>
                            <Stack 
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={1}
                              sx={{ minWidth: { xs: '80px', sm: 'auto' } }}
                            >
                              <Button 
                                variant="contained" 
                                color="success"
                                size="small"
                                className="bg-b"
                                onClick={() => handleEdit(user)}
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  marginBottom: '3px',
                                  '&.MuiButton-root': {
                                    minHeight: '24px'
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
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  marginLeft: '2px',
                                  marginBottom: '3px',
                                  '&.MuiButton-root': {
                                    minHeight: '24px'
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
                          No Users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableContainer>
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
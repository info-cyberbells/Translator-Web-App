import React, { useState, useEffect } from 'react';
import { Grid, Card, Table, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, TextField, Typography,  useMediaQuery, Box,Stack } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Church = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [churches, setChurches] = useState([]);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');  // 'Add' or 'Edit'
  const [currentChurch, setCurrentChurch] = useState({});  // To hold data of church being edited

  // Fetch churches from the API
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
        setChurches(response.data);
      } catch (err) {
        toast.error(err.message || "Error fetching churches");
      }
    };
    fetchChurches();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this church?")) {
      try {
        await axios.delete(`${apiBaseUrl}/church/delete/${id}`);
        setChurches(churches.filter(church => church._id !== id));
        toast.success("Church deleted successfully");
      } catch (err) {
        toast.error(err.message || "Error deleting church");
      }
    }
  };

  // Handle Add Button Click
  const handleAdd = () => {
    setModalType('Save');
    setCurrentChurch({}); // Reset form for adding a new church
    setShowModal(true);
    setValidationError(''); // Reset validation error when opening modal
  };

  // Handle Edit Button Click
  const handleEdit = (church) => {
    setModalType('Update');
    setCurrentChurch(church);
    setShowModal(true);
    setValidationError(''); // Reset validation error when opening modal
  };

  // Function to remove spaces and prevent special characters
  // const sanitizeInput = (input) => {
  //   return input.replace(/[^a-zA-Z0-9\s]/g, '').trim(); // Allow only alphanumeric characters and spaces, remove extra spaces
  // };
  // Function to remove spaces and prevent special characters except for the address field
  // const sanitizeInput = (input, field) => {
  //   if (field === 'address') {
  //     // Allow commas in the address field, but remove other special characters
  //     return input.replace(/[^a-zA-Z0-9,\s]/g, '').trim();
  //   } else {
  //     // Remove all special characters except spaces for other fields
  //     return input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  //   }
  // };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   // Sanitize the form fields
  //   currentChurch.name = sanitizeInput(currentChurch.name || '');
  //   currentChurch.address = sanitizeInput(currentChurch.address || '');
  //   currentChurch.city = sanitizeInput(currentChurch.city || '');

  //   // Validation: Check if 'name' or 'address' are empty after sanitizing
  //   let validationMessage = '';

  //   if (!currentChurch.name) {
  //     validationMessage = "Name is required.";
  //   } else if (!currentChurch.address) {
  //     validationMessage = "Address is required.";
  //   }

  //   if (validationMessage) {
  //     setValidationError(validationMessage);  // Set the validation error message
  //     return;  // Prevent form submission if validation fails
  //   }

  //   try {
  //     if (modalType === 'Save') {
  //       await axios.post(`${apiBaseUrl}/church/add`, currentChurch);
  //       toast.success("Church added successfully");
  //     } else {
  //       await axios.patch(`${apiBaseUrl}/church/edit/${currentChurch._id}`, currentChurch);
  //       toast.success("Church updated successfully");
  //     }
  //     setShowModal(false);
  //     setCurrentChurch({});
  //     setValidationError(''); // Clear validation error on successful submission

  //     // Refresh the churches list
  //     const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
  //     setChurches(response.data);
  //   } catch (err) {
  //     toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
  //   }
  // };
// Update the sanitizeInput function
const sanitizeInput = (input, field) => {
  if (field === 'name') {
    // Allow letters, spaces, and dots for name field, preserve multiple spaces
    return input.replace(/[^a-zA-Z\s.]/g, '').replace(/\.+/g, '.').replace(/\s\s+/g, ' ');
  } 
  else if (field === 'address') {
    // Allow letters, numbers, spaces, commas, dashes, dots, and specific special characters (@, #, &, (, ), /)
    return input
      .replace(/[^a-zA-Z0-9,\s\-\.\@\#\&\'\"\(\)\/]/g, ' ') // Allow alphanumeric and specified special characters
      .replace(/,+/g, ',')    // Replace multiple commas with a single comma
      .replace(/\-+/g, '-')   // Replace multiple dashes with a single dash
      .replace(/\.+/g, '.')   // Replace multiple dots with a single dot
      .replace(/^\s+|\s+$/g, ' '); // Trim leading and trailing spaces, keep internal spaces
  }

  else {
    // Remove all special characters except spaces for other fields
    return input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  }
};

// Update the handleFormSubmit with more permissive name validation

const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Create a payload with only the fields that have values
  const payload = {};

  // Add fields to payload only if they have values
  if (currentChurch.name) {
    payload.name = sanitizeInput(currentChurch.name, 'name');
  }
  if (currentChurch.address) {
    payload.address = sanitizeInput(currentChurch.address, 'address');
  }
  if (currentChurch.city) {
    payload.city = sanitizeInput(currentChurch.city, 'city');
  }
  if (currentChurch.api_key) {
    payload.api_key = sanitizeInput(currentChurch.api_key, 'api_key');
  }

  // More permissive name validation that allows spaces and dots
  const nameFormat = /^[a-zA-Z][a-zA-Z\s.]*$/;
  
  // Initialize an errors object for field-specific validation
  const errors = {};

  // Validate each field independently
  if (!currentChurch.name?.trim()) {
    errors.name = "Name is required";
  } else if (!nameFormat.test(currentChurch.name)) {
    errors.name = "Name can only contain letters, spaces, and dots";
  } else if (currentChurch.name.startsWith('.') || currentChurch.name.endsWith('.')) {
    errors.name = "Name cannot start or end with a dot";
  }

  if (!currentChurch.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!currentChurch.city?.trim()) {
    errors.city = "Suburb is required";
  }

  // If there are any errors, set them and return
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  try {
    if (modalType === 'Save') {
      await axios.post(`${apiBaseUrl}/church/add`, payload);
      toast.success("Church added successfully");
    } else {
      // For update, only send fields that have changed
      const originalChurch = churches.find(c => c._id === currentChurch._id);
      const changedFields = {};

      Object.keys(payload).forEach(key => {
        if (payload[key] !== originalChurch[key]) {
          changedFields[key] = payload[key];
        }
      });

      if (Object.keys(changedFields).length > 0) {
        await axios.patch(`${apiBaseUrl}/church/edit/${currentChurch._id}`, changedFields);
        toast.success("Church updated successfully");
      } else {
        toast.info("No changes detected");
        setShowModal(false);
        return;
      }
    }

    setShowModal(false);
    setCurrentChurch({});
    setValidationErrors({});

    // Refresh the churches list
    const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
    setChurches(response.data);
  } catch (err) {
    toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
  }
};
// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   // Sanitize the form fields
//   currentChurch.name = sanitizeInput(currentChurch.name || '', 'name');
//   currentChurch.address = sanitizeInput(currentChurch.address || '', 'address');
//   currentChurch.city = sanitizeInput(currentChurch.city || '', 'city');

//   // More permissive name validation that allows spaces and dots
//   const nameFormat = /^[a-zA-Z][a-zA-Z\s.]*$/;
  
//   let validationMessage = '';

//   if (!currentChurch.name) {
//     validationMessage = "Name is required.";
//   } else if (!nameFormat.test(currentChurch.name)) {
//     validationMessage = "Name can only contain letters, spaces, and dots";
//   } else if (currentChurch.name.startsWith('.') || currentChurch.name.endsWith('.')) {
//     validationMessage = "Name cannot start or end with a dot";
//   } else if (!currentChurch.address) {
//     validationMessage = "Address is required.";
//   }

//   if (validationMessage) {
//     setValidationError(validationMessage);
//     return;
//   }

//   try {
//     if (modalType === 'Save') {
//       await axios.post(`${apiBaseUrl}/church/add`, currentChurch);
//       toast.success("Church added successfully");
//     } else {
//       await axios.patch(`${apiBaseUrl}/church/edit/${currentChurch._id}`, currentChurch);
//       toast.success("Church updated successfully");
//     }
//     setShowModal(false);
//     setCurrentChurch({});
//     setValidationError('');

//     // Refresh the churches list
//     const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
//     setChurches(response.data);
//   } catch (err) {
//     toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
//   }
// };
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
                Add New Church
              </Button>
            </Box>

            {/* Table Container */}
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              {error && <Typography color="error">{error}</Typography>}
              <TableContainer 
                component={Paper} 
                sx={{ 
                  overflowX: 'auto',
                  '& .MuiTable-root': {
                    minWidth: { xs: '100%', sm: 650 }
                  }
                }}
              >
                <Table>
                  <thead>
                    <tr>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}>Sr. No</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Name</th>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}>Address</th>
                      <th style={{ 
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isTablet ? 'none' : 'table-cell'
                      }}>Suburb</th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churches.length > 0 ? (
                      churches.map((church, index) => (
                        <tr key={church._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}>{index + 1}</td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{church.name}</td>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}>{church.address}</td>
                          <td style={{ 
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isTablet ? 'none' : 'table-cell'
                          }}>{church.city}</td>
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
                                onClick={() => handleEdit(church)}
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
                                onClick={() => handleDelete(church._id)}
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  marginLeft: { xs: 0, sm: '2px' },
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
                        <td colSpan={5} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
                          No churches available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Add/Edit */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{modalType === 'Save' ? 'Add Church' : 'Edit Church'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
          <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.name || ''}
              onChange={(e) => setCurrentChurch({ ...currentChurch, name: sanitizeInput(e.target.value, 'name') })}
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
              error={!!validationError && (validationError.includes('Name') || !currentChurch.name)}
              helperText={validationError && (validationError.includes('Name') || !currentChurch.name) ? validationError : ''}
            />

            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.address || ''}
              onChange={(e) => setCurrentChurch({ 
                ...currentChurch, 
                address: sanitizeInput(e.target.value, 'address') 
              })}
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
              error={!!validationError && !currentChurch.address}
              helperText={validationError && !currentChurch.address ? validationError : ''}
              multiline
              rows={3}
            />

            <TextField
              label="Suburb"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.city || ''}
              onChange={(e) => setCurrentChurch({ ...currentChurch, city: sanitizeInput(e.target.value, 'city') })} // Pass 'city' as the field type

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
              error={!!validationError && !currentChurch.city}
              helperText={validationError && !currentChurch.city ? validationError : ''}
            />

            <TextField
              label="Microsoft Api Key" s
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.api_key || ''}
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
              onChange={(e) => setCurrentChurch({ ...currentChurch, api_key: sanitizeInput(e.target.value) })}
            />
            <DialogActions>
              <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary" >Cancel</Button>
              <Button type="submit" color="primary" style={{ backgroundColor: '#231f20', color: 'white' }}>{modalType}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Church;

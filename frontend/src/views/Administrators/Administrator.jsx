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
  Stack,
  CircularProgress,
  Pagination // Added Pagination import
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import './style.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Administrator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const ITEMS_PER_PAGE = 5; // Added constant for items per page
=======
  const ITEMS_PER_PAGE = 10; // Added constant for items per page
>>>>>>> 9d8938c (latest code pushed to git)

  // Add pagination state
  const [page, setPage] = useState(1);

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

<<<<<<< HEAD
=======
  // Correct sorting in the fetchUsers function
>>>>>>> 9d8938c (latest code pushed to git)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);
      const filteredUsers = response.data.filter((user) => user.type === '2');
<<<<<<< HEAD
=======
      // Sort by created_at (newest first)
      filteredUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
>>>>>>> 9d8938c (latest code pushed to git)
      setUsers(filteredUsers);
    } catch (err) {
      toast.error(err.message || 'Error fetching Administrators');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChurches = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
      setChurches(response.data);
    } catch (err) {
      toast.error(err.message || 'Error fetching churches');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Administrator?')) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        await fetchUsers(); // Refresh the list instead of local filtering
        toast.success('Administrator deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Error deleting Administrator');
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    setCurrentUser({
      type: '2'
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
    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    const whitespaceRegex = /^\s*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!currentUser.firstName?.trim()) {
      errors.firstName = 'First name is required.';
    } else if (currentUser.firstName.trim().length < 3) {
      errors.firstName = 'First name should be at least 3 characters.';
    } else if (specialCharRegex.test(currentUser.firstName)) {
      errors.firstName = 'First name should only contain letters.';
    }

    if (currentUser.lastName?.trim()) {
      if (currentUser.lastName.trim().length < 3) {
        errors.lastName = 'Last name should be at least 3 characters.';
      } else if (specialCharRegex.test(currentUser.lastName)) {
        errors.lastName = 'Last name should only contain letters.';
      }
    }

    if (!currentUser.email) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(currentUser.email)) {
      errors.email = 'Email format is invalid.';
    }

    if (modalType === 'Save') {
      if (!currentUser.password) {
        errors.password = 'Password is required.';
      } else if (currentUser.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }
    }

    if (!currentUser.phone) {
      errors.phone = 'Phone is required.';
    } else if (!/^\d{10}$/.test(currentUser.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!currentUser.suburb) {
      errors.suburb = 'Suburb is required.';
    } else if (specialCharRegex.test(currentUser.suburb) || whitespaceRegex.test(currentUser.suburb)) {
      errors.suburb = 'Suburb must not contain special characters or be empty.';
    }

    if (!currentUser.churchId) {
      errors.churchId = 'Church Name is required.';
    }

    return errors;
  };

<<<<<<< HEAD
=======
  // In the handleFormSubmit function
>>>>>>> 9d8938c (latest code pushed to git)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
<<<<<<< HEAD
      const userToSave = { ...currentUser, type: '2' };

      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        await fetchUsers();
        toast.success('Administrator added successfully');
      } else {
        await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        await fetchUsers();
=======
      // Make sure we're explicitly setting type as '2' for administrator
      const userToSave = { ...currentUser, type: '2' };

      if (modalType === 'Save') {
        await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        // Small delay to ensure the server has processed the request
        setTimeout(async () => {
          await fetchUsers();
          setPage(1); // Reset to first page to see the new entry
        }, 300);
        toast.success('Administrator added successfully');
      } else {
        await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        setTimeout(async () => {
          await fetchUsers();
        }, 300);
>>>>>>> 9d8938c (latest code pushed to git)
        toast.success('Administrator updated successfully');
      }

      setValidationErrors({});
      setCurrentUser({});
      setShowModal(false);
<<<<<<< HEAD
      setPage(1); // Reset to first page after adding/updating
=======
>>>>>>> 9d8938c (latest code pushed to git)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentUser((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  // Add pagination function
  const getPaginatedUsers = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return users.slice(startIndex, endIndex).map((user, index) => ({
      ...user,
      serialNumber: startIndex + index + 1
    }));
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: { xs: 1, sm: 2 }
              }}
            >
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
                Add New Administrator
              </Button>
            </Box>

<<<<<<< HEAD
         
<TableContainer
  component={Paper}
  sx={{
    overflowX: 'auto',
    p: { xs: 1, sm: 2 }
  }}
>
  <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
    <thead>
      <tr>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
          Sr. No
        </th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>First Name</th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Last Name</th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
          Email
        </th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
          Phone
        </th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isTablet ? 'none' : 'table-cell' }}>
          Suburb
        </th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Church Name</th>
        <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {isLoading ? (
        <tr>
          <td colSpan={8} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                size={40}
                sx={{
                  color: '#231f20',
                  '& .MuiCircularProgress-svg': { color: '#231f20' }
                }}
              />
              <Typography variant="body1" color="#231f20">
                Loading administrators...
              </Typography>
            </Box>
          </td>
        </tr>
      ) : users.length > 0 ? (
        getPaginatedUsers().map((user) => (
          <tr
            key={user._id}
            style={{
              backgroundColor: user.serialNumber % 2 === 0 ? '#f9f9f9' : '#ffffff'
            }}
          >
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
              {user.serialNumber}
            </td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.firstName}</td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.lastName}</td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
              {user.email}
            </td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
              {user.phone}
            </td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isTablet ? 'none' : 'table-cell' }}>
              {user.suburb}
            </td>
            <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.churchId?.name || 'N/A'}</td>
            <td>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ minWidth: { xs: '100px', sm: 'auto' } }}
              >
                <Button
                  variant="contained"
                  color="success"
                  size={isMobile ? 'small' : 'medium'}
                  className="bg-b"
                  onClick={() => handleEdit(user)}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    minWidth: '60px',
                    marginBottom: '3px'
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size={isMobile ? 'small' : 'medium'}
                  className="bg-b"
                  onClick={() => handleDelete(user._id)}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    minWidth: '60px',
                    marginBottom: '3px'
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
            No Administrator available
          </td>
        </tr>
      )}
    </tbody>
  </Table>

  {/* Pagination - only show if more than ITEMS_PER_PAGE records */}
  {users.length > ITEMS_PER_PAGE && (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#231f20',
          },
          '& .Mui-selected': {
            backgroundColor: '#231f20 !important',
            color: 'white !important',
          }
        }}
      />
    </Box>
  )}
</TableContainer>
=======

            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                p: { xs: 1, sm: 2 }
              }}
            >
              <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                <thead>
                  <tr>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                      Sr. No
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>First Name</th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Last Name</th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                      Email
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                      Phone
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isTablet ? 'none' : 'table-cell' }}>
                      Suburb
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Church Name</th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <CircularProgress
                            size={40}
                            sx={{
                              color: '#231f20',
                              '& .MuiCircularProgress-svg': { color: '#231f20' }
                            }}
                          />
                          <Typography variant="body1" color="#231f20">
                            Loading administrators...
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    getPaginatedUsers().map((user) => (
                      <tr
                        key={user._id}
                        style={{
                          backgroundColor: user.serialNumber % 2 === 0 ? '#f9f9f9' : '#ffffff'
                        }}
                      >
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                          {user.serialNumber}
                        </td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.firstName}</td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.lastName}</td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                          {user.email}
                        </td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                          {user.phone}
                        </td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isTablet ? 'none' : 'table-cell' }}>
                          {user.suburb}
                        </td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.churchId?.name || 'N/A'}</td>
                        <td>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            sx={{ minWidth: { xs: '100px', sm: 'auto' } }}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              size={isMobile ? 'small' : 'medium'}
                              className="bg-b"
                              onClick={() => handleEdit(user)}
                              fullWidth={isMobile}
                              sx={{
                                fontSize: '11px',
                                padding: '4px 8px',
                                minWidth: '60px',
                                marginBottom: '3px'
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size={isMobile ? 'small' : 'medium'}
                              className="bg-b"
                              onClick={() => handleDelete(user._id)}
                              fullWidth={isMobile}
                              sx={{
                                fontSize: '11px',
                                padding: '4px 8px',
                                minWidth: '60px',
                                marginBottom: '3px'
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
                        No Administrator available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination - only show if more than ITEMS_PER_PAGE records */}
              {users.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      }
                    }}
                  />
                </Box>
              )}
            </TableContainer>
>>>>>>> 9d8938c (latest code pushed to git)
          </Card>
        </Grid>
      </Grid>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>{modalType === 'Save' ? 'Add Administrator' : 'Edit Administrator'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={currentUser.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              {/* Rest of the form fields remain unchanged */}
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={currentUser.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={currentUser.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  disabled={modalType === 'Update'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {modalType === 'Save' && (
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={currentUser.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#231f20' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#231f20' },
                        '&:hover fieldset': { borderColor: '#231f20' },
                        '&.Mui-focused fieldset': { borderColor: '#231f20' }
                      },
                      '& .MuiInputLabel-root': { color: '#231f20' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                    }}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={currentUser.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  value={currentUser.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={!!validationErrors.address}
                  helperText={validationErrors.address}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Suburb"
                  variant="outlined"
                  fullWidth
                  value={currentUser.suburb || ''}
                  onChange={(e) => handleInputChange('suburb', e.target.value)}
                  error={!!validationErrors.suburb}
                  helperText={validationErrors.suburb}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!!validationErrors.churchId}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#231f20' },
                      '&:hover fieldset': { borderColor: '#231f20' },
                      '&.Mui-focused fieldset': { borderColor: '#231f20' }
                    },
                    '& .MuiInputLabel-root': { color: '#231f20' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
                  }}
                >
                  <InputLabel>Church Name</InputLabel>
                  <Select
                    value={currentUser.churchId || ''}
                    onChange={(e) => handleInputChange('churchId', e.target.value)}
                    label="Church Name"
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
                    <Typography color="error" variant="caption">
                      {validationErrors.churchId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary" fullWidth={isMobile}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="bg-b" color="primary" fullWidth={isMobile}>
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
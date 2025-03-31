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

const User = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const ITEMS_PER_PAGE = 10; // Added constant for items per page

  // Add pagination state
=======
  const ITEMS_PER_PAGE = 10; 

  
>>>>>>> 9d8938c (latest code pushed to git)
  const [page, setPage] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
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
    setIsLoading(true);
    try {
      const userType = localStorage.getItem('userType');
      const churchId = localStorage.getItem('churchId');
      const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);

      const filteredUsers = response.data
        .filter((user) => {
          if (userType === '1') {
            return user.type === '4' && user.churchId && user.churchId._id;
          } else if (userType === '2') {
            return user.type === '4' && user.churchId && user.churchId._id === churchId;
          } else {
            return user.type === '4' && user.churchId && user.churchId._id === churchId;
          }
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error(err.message || 'Error fetching users');
    }
    finally {
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
    if (window.confirm('Are you sure you want to delete this User?')) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        await fetchUsers();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Error deleting User');
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
    const specialCharRegex = /[^a-zA-Z\s]/;
    const whitespaceRegex = /^\s*$/;

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

    if (modalType === 'Save') {
      if (!currentUser.password) {
        errors.password = 'Password is required.';
      } else if (currentUser.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }
    }

    if (!currentUser.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(currentUser.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!currentUser.phone?.trim()) {
      errors.phone = 'Phone is required.';
    } else if (!/^\d{10}$/.test(currentUser.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!currentUser.suburb?.trim()) {
      errors.suburb = 'Suburb is required.';
    } else if (specialCharRegex.test(currentUser.suburb)) {
      errors.suburb = 'Suburb should only contain letters.';
    }

    const userType = localStorage.getItem('userType');
    if (userType === '1' && !currentUser.churchId) {
      errors.churchId = 'Please select a church.';
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setCurrentUser((prev) => ({
      ...prev,
      [field]: value
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    try {
      const userType = localStorage.getItem('userType');
      const churchIdFromStorage = localStorage.getItem('churchId');
      const userToSave = {
        ...currentUser,
        type: '4',
        churchId: userType === '2' || userType === '3' ? churchIdFromStorage : currentUser.churchId || null
      };

      if (!userToSave.churchId) {
        delete userToSave.churchId;
      }

      if (modalType === 'Save' && !userToSave.password) {
        userToSave.password = Math.random().toString(36).slice(-8);
      }

      if (modalType === 'Save') {
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        if (response.data) {
          await fetchUsers();
          toast.success('User added successfully');
        }
      } else {
        if (userToSave.password === undefined) {
          delete userToSave.password;
        }
        const response = await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        if (response.data) {
          await fetchUsers();
          toast.success('User updated successfully');
        }
      }

      setValidationErrors({});
      setError(null);
      setCurrentUser({});
      setShowModal(false);
      setPage(1); // Reset to first page after adding/updating
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(apiError);
      toast.error(apiError || `Error during ${modalType.toLowerCase()} operation`);
      console.error('Error details:', err);
    }
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

  const userType = localStorage.getItem('userType');

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
                Add New User
              </Button>
            </Box>

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
                              '& .MuiCircularProgress-svg': {
                                color: '#231f20'
                              }
                            }}
                          />
                          <Typography variant="body1" color="#231f20">
                            Loading users...
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    getPaginatedUsers().map((user) => (
                      <tr key={user._id} style={{ backgroundColor: user.serialNumber % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
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
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { xs: '80px', sm: 'auto' } }}>
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
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Add/Edit remains unchanged */}
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
                  '& fieldset': { borderColor: '#231f20' },
                  '&:hover fieldset': { borderColor: '#231f20' },
                  '&.Mui-focused fieldset': { borderColor: '#231f20' }
                },
                '& .MuiInputLabel-root': { color: '#231f20' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
              }}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
            />
            {/* Rest of the form fields remain unchanged */}
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#231f20' },
                  '&:hover fieldset': { borderColor: '#231f20' },
                  '&.Mui-focused fieldset': { borderColor: '#231f20' }
                },
                '& .MuiInputLabel-root': { color: '#231f20' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
              }}
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
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            {error && <Typography color="error">{error}</Typography>}
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
                      {showPassword ? <Visibility /> : <VisibilityOff />}
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
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#231f20' },
                  '&:hover fieldset': { borderColor: '#231f20' },
                  '&.Mui-focused fieldset': { borderColor: '#231f20' }
                },
                '& .MuiInputLabel-root': { color: '#231f20' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
              }}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
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
                  '& fieldset': { borderColor: '#231f20' },
                  '&:hover fieldset': { borderColor: '#231f20' },
                  '&.Mui-focused fieldset': { borderColor: '#231f20' }
                },
                '& .MuiInputLabel-root': { color: '#231f20' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
              }}
            />
            {userType !== '2' && userType !== '3' && (
              <FormControl
                fullWidth
                margin="normal"
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
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Table,
  Button,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  CircularProgress,
  TableContainer,
  Pagination // Added Pagination import
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import StaffMemberModal from './StaffMemberModal';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StaffMember = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const ITEMS_PER_PAGE = 5; // Added constant for items per page

  // Add pagination state
=======
  const ITEMS_PER_PAGE = 10; 


>>>>>>> 9d8938c (latest code pushed to git)
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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const userType = localStorage.getItem('userType');
      const churchId = localStorage.getItem('churchId');
      const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);

      const filteredUsers = response.data
        .filter((user) => {
          if (userType === '1') {
            return user.type === '3' && user.churchId && user.churchId._id;
          } else if (userType === '2') {
            return user.type === '3' && user.churchId && user.churchId._id === churchId;
          } else {
            return user.type === '3' && user.churchId && user.churchId._id === churchId;
          }
        })
<<<<<<< HEAD
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
=======
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
>>>>>>> 9d8938c (latest code pushed to git)

      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error(err.message || 'Error fetching users');
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
    if (window.confirm('Are you sure you want to delete this Staff member?')) {
      try {
        await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
        await fetchUsers(); // Refresh the list instead of local filtering
        toast.success('Staff member deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Error deleting Staff member');
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    const userType = localStorage.getItem('userType');
    const churchIdFromStorage = localStorage.getItem('churchId');

    setCurrentUser({
      type: '3',
      churchId: userType === '2' ? churchIdFromStorage : ''
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

    if (!currentUser.phone) {
      errors.phone = 'Phone is required.';
    } else if (!/^\d{10}$/.test(currentUser.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (modalType === 'Save') {
      if (!currentUser.password) {
        errors.password = 'Password is required.';
      } else if (currentUser.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }
    }

    if (!currentUser.suburb) {
      errors.suburb = 'Suburb is required.';
    } else if (specialCharRegex.test(currentUser.suburb) || whitespaceRegex.test(currentUser.suburb)) {
      errors.suburb = 'Suburb must not contain special characters or be empty.';
    }

    const userType = localStorage.getItem('userType');
    if (userType === '1' && !currentUser.churchId) {
      errors.churchId = 'Church Name is required.';
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
      const userType = localStorage.getItem('userType');
      const churchIdFromStorage = localStorage.getItem('churchId');
  
      let userToSave = {
        ...currentUser,
        type: '3'
      };
<<<<<<< HEAD

      if (userType === '2') {
        userToSave.churchId = churchIdFromStorage;
      }
      else if (userType === '1') {
=======
  
      if (userType === '2') {
        userToSave.churchId = churchIdFromStorage;
      } else if (userType === '1') {
>>>>>>> 9d8938c (latest code pushed to git)
        userToSave.churchId = currentUser.churchId;
      }
  
      if (modalType === 'Save') {
        if (!userToSave.password) {
          userToSave.password = Math.random().toString(36).slice(-8);
        }
  
        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        if (response.data) {
<<<<<<< HEAD
          await fetchUsers();
=======
          // Add the new staff member to the top of the list
          setUsers((prevUsers) => [response.data, ...prevUsers]); // Newest first
>>>>>>> 9d8938c (latest code pushed to git)
          toast.success('Staff member added successfully');
        }
      } else {
        if (!userToSave.password) {
          delete userToSave.password;
        }
        const response = await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        if (response.data) {
<<<<<<< HEAD
          await fetchUsers();
=======
          await fetchUsers(); // Refetch to maintain sorting after update
>>>>>>> 9d8938c (latest code pushed to git)
          toast.success('Staff member updated successfully');
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
                  mb: { xs: 2, sm: 0 },
                  backgroundColor: '#231f20',
                  '&:hover': { backgroundColor: '#3d3a3b' }
                }}
              >
                Add New Staff member
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
                              '& .MuiCircularProgress-svg': { color: '#231f20' }
                            }}
                          />
                          <Typography variant="body1" color="#231f20">
                            Loading staff members...
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
                                backgroundColor: '#231f20',
                                '&:hover': { backgroundColor: '#3d3a3b' },
                                '&.MuiButton-root': { minHeight: '24px' }
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
                                backgroundColor: '#d32f2f',
                                '&:hover': { backgroundColor: '#b71c1c' },
                                '&.MuiButton-root': { minHeight: '24px' }
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
                        No Staff member available
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

      <StaffMemberModal
        open={showModal}
        onClose={() => setShowModal(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        modalType={modalType}
        validationErrors={validationErrors}
        handleFormSubmit={handleFormSubmit}
        churches={churches}
        userType={userType}
        error={error}
      />
    </React.Fragment>
  );
};

export default StaffMember;
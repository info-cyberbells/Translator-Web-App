import React, { useState, useEffect, useRef } from 'react';
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
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Stack,
  Select,
  InputLabel,
  Chip,
  MenuItem,
  FormControl,
  CircularProgress
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import { Pagination } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Event = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const churchId = localStorage.getItem('churchId');
  const [isLoading, setIsLoading] = useState(true);
  const [churches, setChurches] = useState([]);
  const userType = localStorage.getItem('userType') == '1'; //SuperAdmin
  const userType3 = localStorage.getItem('userType') == '3'; //Staff
  const [eventPage, setEventPage] = useState(1);
<<<<<<< HEAD
  const ITEMS_PER_PAGE = 5;
=======
  const ITEMS_PER_PAGE = 10;
>>>>>>> 9d8938c (latest code pushed to git)

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      if (localStorage.getItem('userType') === '1') {
        await fetchChurches();
      }
    };
    fetchData();
  }, []);
  // Updated date formatting function
  const formatDateForDisplay = (dateTimeString) => {
    if (!dateTimeString) return '';

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleString('en-US', {
        timeZone: 'UTC', // Force UTC instead of local timezone
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Keep AM/PM format
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const fetchChurches = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
      console.log('RESPONSE CHURCHES', response.data);

      setChurches(response.data); // Assuming the response is an array of church names
    } catch (err) {
      toast.error(err.message || 'Error fetching churches');
    }
  };
  // Updated function to format date for input field
  const formatDateForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      // Format to YYYY-MM-DDTHH:mm
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  // Modified handleRemoveImage function with correct indexing
  const handleRemoveImage = async (index, imageUrl) => {
    // Check if the image is from database (starts with http)
    const isDbImage = typeof imageUrl === 'string' && imageUrl.startsWith('http');

    if (isDbImage && currentUser._id) {
      try {
        // Find the index of this image URL in the database images array
        const dbIndex = currentUser.images.findIndex((img) => img === imageUrl);

        if (dbIndex === -1) {
          toast.error('Image not found in database');
          return;
        }

        // Call API to delete the image by index
        const response = await axios.post(`${apiBaseUrl}/event/deleteImages/${currentUser._id}`, {
          imageIndices: [dbIndex]
        });

        if (response.data) {
          // If successful, update the current user's images from the response
          if (response.data.remainingImages) {
            setImages(response.data.remainingImages);
            setPreviewImages(response.data.remainingImages);

            // Also update the currentUser state
            setCurrentUser((prev) => ({
              ...prev,
              images: response.data.remainingImages
            }));
          } else {
            // Remove from preview and current images arrays if no response data
            setImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
            setPreviewImages((prevPreviews) => prevPreviews.filter((img) => img !== imageUrl));

            // Also update the currentUser state
            setCurrentUser((prev) => ({
              ...prev,
              images: prev.images.filter((img) => img !== imageUrl)
            }));
          }

          toast.success('Image deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image: ' + (error.response?.data?.error || error.message));
      }
    } else {
<<<<<<< HEAD
      // For newly uploaded images (not yet saved to DB), just remove from state
=======
>>>>>>> 9d8938c (latest code pushed to git)
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setPreviewImages((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    }
  };

  const isDateBeforeCurrent = (dateString) => {
    if (!dateString) return false;
    try {
      const eventDate = new Date(dateString);
      if (isNaN(eventDate.getTime())) return false;
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
    setIsLoading(true);
    try {
      const userType = localStorage.getItem('userType');
<<<<<<< HEAD
      // Always include churchId in query params for filtering on backend
=======
>>>>>>> 9d8938c (latest code pushed to git)
      const endpoint = `${apiBaseUrl}/event/fetchAll${userType !== '1' ? `/${churchId}` : ''}`;
      const response = await axios.get(endpoint);

      const formattedUsers = response.data.map((user) => ({
        ...user,
        date: user.date ? new Date(user.date).toISOString() : null
      }));

      // Get today's date (normalized to midnight for comparison)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Sort events:
      // 1. Today's events first
      // 2. Future events (ascending order: nearest to farthest)
      // 3. Past events (descending order: most recent to oldest)
      const sortedUsers = formattedUsers.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);

        // Normalize dates to midnight for accurate day comparison
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);


        const isADateToday = dateA.getTime() === today.getTime();
        const isBDateToday = dateB.getTime() === today.getTime();


        if (isADateToday && !isBDateToday) return -1;
        if (!isADateToday && isBDateToday) return 1;
        if (isADateToday && isBDateToday) return 0;


        const isAFuture = dateA > today;
        const isBFuture = dateB > today;

        if (isAFuture && isBFuture) {
          return dateA - dateB;
        }
        if (isAFuture && !isBFuture) return -1;
        if (!isAFuture && isBFuture) return 1;


        return dateB - dateA;
      });

      setUsers(sortedUsers);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching Events');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaginatedEvents = () => {
    const startIndex = (eventPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return users.slice(startIndex, endIndex).map((user, index) => ({
      ...user,
      serialNumber: startIndex + index + 1
    }));
  };

  const handleEventPageChange = (event, value) => {
    setEventPage(value);
  };

  const eventTotalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Event?')) {
      try {
        await axios.delete(`${apiBaseUrl}/event/delete/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        toast.success('Event deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting Event');
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    const userType = localStorage.getItem('userType');
    const churchId = localStorage.getItem('churchId');

    setCurrentUser({
      date: formatDateForInput(new Date()),
      // For non-admin users, always include churchId from localStorage
      churchId: userType !== '1' ? churchId : ''
    });

    setImages([]);
    setPreviewImages([]);
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const handleEdit = (user) => {
    setModalType('Update');
    const userType = localStorage.getItem('userType');
    const churchId = localStorage.getItem('churchId');

    const formattedUser = {
      ...user,
      date: formatDateForInput(user.date),
      churchId: userType === '1' ? user.churchId : churchId
    };

    if (user.images && user.images.length > 0) {
      setImages(user.images);
      setPreviewImages(user.images);
    } else {
      setImages([]);
      setPreviewImages([]);
    }

    // Reset imagesToDelete when editing
    setImagesToDelete([]);

    setCurrentUser(formattedUser);
    setShowModal(true);
    setError(null);
  };

  const validateForm = () => {
    const errors = {};
    const userTypeValue = localStorage.getItem('userType');

    if (!currentUser.name || currentUser.name.trim() === '') {
      errors.name = 'Event Name is required.';
    }

    if (!currentUser.date) {
      errors.date = 'Event Date is required.';
    } else {
      // Validate date format
      const date = new Date(currentUser.date);
      if (isNaN(date.getTime())) {
        errors.date = 'Invalid date format';
      }
    }

    // Only validate event_church_location for admin users (type 1)
    // OR if it's required for all users but just the UI is conditional
    // if (userTypeValue === '1') {
    // if (!currentUser.event_church_location || currentUser.event_church_location.trim() === '') {
    //   errors.event_church_location = 'Event Church Location is required.';
    // }

    // If admin user, also validate churchId selection
    if (!currentUser.churchId) {
      errors.churchId = 'Church Name is required.';
    }
    // }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setCurrentUser((prevState) => ({
      ...prevState,
      [field]: value
    }));
<<<<<<< HEAD
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Access userTypeValue directly from localStorage
    const userTypeValue = localStorage.getItem('userType');
    console.log('USERTYPE from localStorage', userTypeValue);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    // console.log("USERTYPEAfterValidate from localStorage", userTypeValue);

    try {
      const churchId = localStorage.getItem('churchId');

      // For superadmin (userType='1'), use the selected church's _id as churchId
      // For others, use churchId from localStorage
      const eventData = {
        ...currentUser,
        churchId: userTypeValue === '1' ? currentUser.churchId : churchId,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        images: images
      };

      console.log('Event data being submitted:', eventData);

      let response;
      if (modalType === 'Save') {
        response = await axios.post(`${apiBaseUrl}/event/add`, eventData);
        if (response.data) {
          console.log('Response data after save:', response.data);
          setUsers([...users, response.data]);
          toast.success('Event saved successfully');
          fetchUsers();
        }
      } else {
        response = await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, eventData);
        if (response.data) {
          console.log('Response data after update:', response.data);
          setUsers(users.map((user) => (user._id === currentUser._id ? response.data : user)));
          toast.success('Event updated successfully');
          fetchUsers();
        }
      }

      setShowModal(false);
      setCurrentUser({});
      setValidationErrors({});
      setImages([]);
      setPreviewImages([]);
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || `Error during ${modalType.toLowerCase()} operation`;
      toast.error(errorMessage);
      setError(errorMessage);
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
  //     const userType = localStorage.getItem('userType');
  //     const churchId = localStorage.getItem('churchId');
  //     // For superadmin, use the selected church's _id as churchId

  //     // For others, use churchId from localStorage
  //     const eventData = {
  //       ...currentUser,
  //       churchId: userType === '1' ? currentUser.churchId : churchId,
  //       createdAt: currentUser.createdAt || new Date().toISOString(),
  //       images: images
  //     };

  //     if (modalType === 'Save') {
  //       const response = await axios.post(`${apiBaseUrl}/event/add`, eventData);
  //       console.log('EVENTDresponse.data', response.data);
  //       if (response.data) {
  //         setUsers([...users, response.data]);
  //         toast.success('Event saved successfully');
  //         fetchUsers();
  //       }
  //     } else {
  //       const response = await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, eventData);
  //       if (response.data) {
  //         setUsers(users.map((user) => (user._id === currentUser._id ? response.data : user)));
  //         toast.success('Event updated successfully');
  //         fetchUsers();
  //       }
  //     }

  //     setShowModal(false);
  //     setCurrentUser({});
  //     setValidationErrors({});
  //     setImages([]);
  //     setPreviewImages([]);
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || err.response?.data?.error || `Error during ${modalType.toLowerCase()} operation`;
  //     toast.error(errorMessage);
  //     setError(errorMessage);
  //   }
  // };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Process each file
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target.result;

        // Add new image to state
        setImages((prevImages) => [...prevImages, base64String]);
        setPreviewImages((prevPreviews) => [...prevPreviews, base64String]);
      };

      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = null;
  };

  // Trigger file input click
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
=======
>>>>>>> 9d8938c (latest code pushed to git)
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userTypeValue = localStorage.getItem('userType');
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const churchId = localStorage.getItem('churchId');
      const eventData = {
        ...currentUser,
        churchId: userTypeValue === '1' ? currentUser.churchId : churchId,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        images: images
      };

      let response;
      if (modalType === 'Save') {
        response = await axios.post(`${apiBaseUrl}/event/add`, eventData);
        if (response.data) {
          // Close the modal first
          setShowModal(false);
          setCurrentUser({});
          setValidationErrors({});
          setImages([]);
          setPreviewImages([]);

          // Then refetch all events to ensure proper sorting and display
          await fetchUsers();
          toast.success('Event saved successfully');
        }
      } else {
        response = await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, eventData);
        if (response.data) {
          // Close the modal first
          setShowModal(false);
          setCurrentUser({});
          setValidationErrors({});
          setImages([]);
          setPreviewImages([]);

          // Then refetch all events to ensure proper sorting and display
          await fetchUsers();
          toast.success('Event updated successfully');
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || `Error during ${modalType.toLowerCase()} operation`;
      toast.error(errorMessage);
      setError(errorMessage);
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
  //     const userType = localStorage.getItem('userType');
  //     const churchId = localStorage.getItem('churchId');
  //     // For superadmin, use the selected church's _id as churchId

  //     // For others, use churchId from localStorage
  //     const eventData = {
  //       ...currentUser,
  //       churchId: userType === '1' ? currentUser.churchId : churchId,
  //       createdAt: currentUser.createdAt || new Date().toISOString(),
  //       images: images
  //     };

  //     if (modalType === 'Save') {
  //       const response = await axios.post(`${apiBaseUrl}/event/add`, eventData);
  //       console.log('EVENTDresponse.data', response.data);
  //       if (response.data) {
  //         setUsers([...users, response.data]);
  //         toast.success('Event saved successfully');
  //         fetchUsers();
  //       }
  //     } else {
  //       const response = await axios.patch(`${apiBaseUrl}/event/edit/${currentUser._id}`, eventData);
  //       if (response.data) {
  //         setUsers(users.map((user) => (user._id === currentUser._id ? response.data : user)));
  //         toast.success('Event updated successfully');
  //         fetchUsers();
  //       }
  //     }

  //     setShowModal(false);
  //     setCurrentUser({});
  //     setValidationErrors({});
  //     setImages([]);
  //     setPreviewImages([]);
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || err.response?.data?.error || `Error during ${modalType.toLowerCase()} operation`;
  //     toast.error(errorMessage);
  //     setError(errorMessage);
  //   }
  // };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Process each file
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target.result;

        // Add new image to state
        setImages((prevImages) => [...prevImages, base64String]);
        setPreviewImages((prevPreviews) => [...prevPreviews, base64String]);
      };

      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = null;
  };

  // Trigger file input click
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <React.Fragment>
      <ToastContainer />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* Add Button Container */}
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
                Add New Event
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
                    <th
                      style={{
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}
                    >
                      Sr. No
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Event Name</th>
                    <th
                      style={{
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}
                    >
                      Event Date
                    </th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Status</th>
                    {/* {userType && userType3 && <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Event Church Location</th>} */}

                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
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
                            Loading stafff members...
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    getPaginatedEvents().map((user) => {
                      const isDisabled = isDateBeforeCurrent(user.date);
                      return (
                        <tr
                          key={user._id}
                          style={{ backgroundColor: (user.serialNumber - 1) % 2 === 0 ? '#f9f9f9' : '#ffffff' }}
                        >
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2), display: isMobile ? 'none' : 'table-cell' }}>
                            {user.serialNumber}
                          </td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.name}</td>

                          <td
                            style={{
                              padding: theme.spacing(isMobile ? 1 : 2),
                              display: isMobile ? 'none' : 'table-cell'
                            }}
                          >
                            {formatDateForDisplay(user.date)}
                          </td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>
                            <Chip
                              label={isDisabled ? 'Expired' : 'Active'}
                              color={isDisabled ? 'error' : 'success'}
                              size={isMobile ? 'small' : 'medium'}
                              sx={{
                                backgroundColor: isDisabled ? '#ffebee' : '#e8f5e9',
                                color: isDisabled ? '#d32f2f' : '#2e7d32'
                              }}
                            />
                          </td>

                          {/* {userType && userType3 && <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.event_church_location}</td>} */}

                          <td>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { xs: '80px', sm: 'auto' } }}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                className="bg-b"
                                onClick={() => handleEdit(user)}
                                disabled={userType3}
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  opacity: userType3 ? 0.7 : 1,
                                  backgroundColor: '#4CAF50',
                                  '&.Mui-disabled': {
                                    backgroundColor: '#4CAF50',
                                    color: 'white'
                                  },
                                  '&:hover': {
                                    backgroundColor: '#45a049'
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
                                disabled={userType3}
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  opacity: userType3 ? 0.7 : 1,
                                  backgroundColor: '#ef5350',
                                  '&.Mui-disabled': {
                                    backgroundColor: '#ef5350',
                                    color: 'white'
                                  },
                                  '&:hover': {
                                    backgroundColor: '#d32f2f'
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: 'center',
                          padding: theme.spacing(2)
                        }}
                      >
                        No Event available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {users.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                  <Pagination
                    count={eventTotalPages}
                    page={eventPage}
                    onChange={handleEventPageChange}
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
                    borderColor: '#231f20'
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20'
                }
              }}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            {/* <TextField
              label="Event Date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.createdAt || ''}
              onChange={(e) => handleInputChange('createdAt', e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#231f20'
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20'
                }
              }}
              error={!!validationErrors.date}
              helperText={validationErrors.date}
            /> */}
            <TextField
              label="Event Date & Time"
              type="datetime-local" // Changed from 'date' to 'datetime-local'
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentUser.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#231f20'
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20'
                }
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
                    borderColor: '#231f20'
                  },
                  '&:hover fieldset': {
                    borderColor: '#231f20'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#231f20'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#231f20'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#231f20'
                }
              }}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
            {userType && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Event Images
                </Typography>

                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

                <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} onClick={handleAddPhotoClick} sx={{ mb: 2 }}>
                  {modalType === 'Update' ? 'Update Photos' : 'Add Photos'}
                </Button>

                {/* Image Preview Section */}
                {previewImages.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 2
                    }}
                  >
                    {previewImages.map((img, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Event preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'red',
                            bgcolor: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)'
                            }
                          }}
                          onClick={() => handleRemoveImage(index, img)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
            {/* {userType && (
              <TextField
                label="Event Church Location"
                variant="outlined"
                fullWidth
                margin="normal"
                value={currentUser.event_church_location || ''}
                onChange={(e) => handleInputChange('event_church_location', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#231f20'
                    },
                    '&:hover fieldset': {
                      borderColor: '#231f20'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#231f20'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#231f20'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#231f20'
                  }
                }}
                error={!!validationErrors.event_church_location}
                helperText={validationErrors.event_church_location}
              />
            )} */}

            {userType && (
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
            )}
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

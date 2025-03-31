import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Table,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Box,
  Stack,
<<<<<<< HEAD
  CircularProgress
=======
  CircularProgress,
  Pagination // Added Pagination import
>>>>>>> 9d8938c (latest code pushed to git)
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Church = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
=======
  const ITEMS_PER_PAGE = 10; // Added constant for items per page
  const [page, setPage] = useState(1); // Added pagination state
>>>>>>> 9d8938c (latest code pushed to git)

  const [churches, setChurches] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentChurch, setCurrentChurch] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    contact_no: '',
    senior_pastor_name: '',
    senior_pastor_phone_number: '',
    api_key: ''
  });

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    setIsLoading(true);
<<<<<<< HEAD

=======
>>>>>>> 9d8938c (latest code pushed to git)
    try {
      const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);

      const sortedChurches = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setChurches(sortedChurches);
    } catch (err) {
      toast.error(err.message || 'Error fetching churches');
    } finally {
<<<<<<< HEAD
      setIsLoading(false); // Set loading to false after fetching (whether successful or not)
=======
      setIsLoading(false);
>>>>>>> 9d8938c (latest code pushed to git)
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this church?')) {
      try {
        await axios.delete(`${apiBaseUrl}/church/delete/${id}`);
        setChurches(churches.filter((church) => church._id !== id));
        toast.success('Church deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Error deleting church');
      }
    }
  };

  const handleAdd = () => {
    setModalType('Save');
    setCurrentChurch({
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      contact_no: '',
      senior_pastor_name: '',
      senior_pastor_phone_number: '',
      api_key: ''
    });
    setShowModal(true);
    setValidationErrors({});
  };

  const handleEdit = (church) => {
    setModalType('Update');
    setCurrentChurch({
      ...church,
      api_key: church.api_key || ''
    });
    setShowModal(true);
    setValidationErrors({});
  };

  const sanitizeInput = (input, field) => {
<<<<<<< HEAD
    if (field === 'name') {
=======
    if (field === 'name' || field === 'senior_pastor_name') {
>>>>>>> 9d8938c (latest code pushed to git)
      return input
        .replace(/[^a-zA-Z\s.]/g, '')
        .replace(/\.+/g, '.')
        .replace(/\s\s+/g, ' ');
    } else if (field === 'address') {
      return input
        .replace(/[^a-zA-Z0-9,\s\-\.\@\#\&\'\"\(\)\/]/g, ' ')
        .replace(/,+/g, ',')
        .replace(/\-+/g, '-')
        .replace(/\.+/g, '.')
        .replace(/^\s+|\s+$/g, ' ');
<<<<<<< HEAD
    } else if (field === 'city') {
      return input.replace(/[^a-zA-Z\s]/g, '').trim();
=======
    } else if (field === 'city' || field === 'state' || field === 'country') {
      return input.replace(/[^a-zA-Z\s]/g, '').trim();
    } else if (field === 'contact_no' || field === 'senior_pastor_phone_number') {
      return input.replace(/[^0-9]/g, '').trim();
>>>>>>> 9d8938c (latest code pushed to git)
    } else {
      return input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameFormat = /^[a-zA-Z][a-zA-Z\s.]*$/;
    const cityStateCountryFormat = /^[a-zA-Z\s]+$/;
    const contactNumberFormat = /^\d{10}$/;

    if (!currentChurch.name?.trim()) {
      errors.name = 'Name is required';
    } else if (!nameFormat.test(currentChurch.name)) {
      errors.name = 'Name can only contain letters, spaces, and dots';
    } else if (currentChurch.name.startsWith('.') || currentChurch.name.endsWith('.')) {
      errors.name = 'Name cannot start or end with a dot';
    } else if (currentChurch.name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    if (!currentChurch.address?.trim()) {
      errors.address = 'Address is required';
    } else if (currentChurch.address.length < 3) {
      errors.address = 'Address must be at least 3 characters long';
    }

<<<<<<< HEAD
    // City validation
=======
>>>>>>> 9d8938c (latest code pushed to git)
    if (!currentChurch.city?.trim()) {
      errors.city = 'Suburb is required';
    } else if (!cityStateCountryFormat.test(currentChurch.city)) {
      errors.city = 'Suburb can only contain letters and spaces';
    } else if (currentChurch.city.length < 3) {
      errors.city = 'Suburb must be at least 3 characters long';
    }

<<<<<<< HEAD
    // State validation
=======
>>>>>>> 9d8938c (latest code pushed to git)
    if (!currentChurch.state?.trim()) {
      errors.state = 'State is required';
    } else if (!cityStateCountryFormat.test(currentChurch.state)) {
      errors.state = 'State can only contain letters and spaces';
    } else if (currentChurch.state.length < 3) {
      errors.state = 'State must be at least 3 characters long';
    }

<<<<<<< HEAD
    // Country validation
=======
>>>>>>> 9d8938c (latest code pushed to git)
    if (!currentChurch.country?.trim()) {
      errors.country = 'Country is required';
    } else if (!cityStateCountryFormat.test(currentChurch.country)) {
      errors.country = 'Country can only contain letters and spaces';
    } else if (currentChurch.country.length < 3) {
      errors.country = 'Country must be at least 3 characters long';
    }

<<<<<<< HEAD
    // Contact Number validation
=======
>>>>>>> 9d8938c (latest code pushed to git)
    if (!currentChurch.contact_no?.trim()) {
      errors.contact_no = 'Contact number is required';
    } else if (!contactNumberFormat.test(currentChurch.contact_no)) {
      errors.contact_no = 'Contact number must be exactly 10 digits';
    }
<<<<<<< HEAD
    if (!currentChurch.senior_pastor_name?.trim()) {
      errors.senior_pastor_name = 'Pastor Name is required';
    } else if (!nameFormat.test(currentChurch.name)) {
      errors.senior_pastor_name = 'Paster Name can only contain letters, spaces, and dots';
    } else if (currentChurch.senior_pastor_name.startsWith('.') || currentChurch.senior_pastor_name.endsWith('.')) {
      errors.senior_pastor_name = 'Paster Name cannot start or end with a dot';
    } else if (currentChurch.senior_pastor_name.length < 3) {
      errors.senior_pastor_name = 'Paster Name must be at least 3 characters long';
    }
    if (!currentChurch.senior_pastor_phone_number?.trim()) {
      errors.senior_pastor_phone_number = 'Paster phone number is required';
    } else if (!contactNumberFormat.test(currentChurch.senior_pastor_phone_number)) {
      errors.senior_pastor_phone_number = 'Paster Phone number must be exactly 10 digits';
=======

    if (!currentChurch.senior_pastor_name?.trim()) {
      errors.senior_pastor_name = 'Pastor Name is required';
    } else if (!nameFormat.test(currentChurch.senior_pastor_name)) {
      errors.senior_pastor_name = 'Pastor Name can only contain letters, spaces, and dots';
    } else if (currentChurch.senior_pastor_name.startsWith('.') || currentChurch.senior_pastor_name.endsWith('.')) {
      errors.senior_pastor_name = 'Pastor Name cannot start or end with a dot';
    } else if (currentChurch.senior_pastor_name.length < 3) {
      errors.senior_pastor_name = 'Pastor Name must be at least 3 characters long';
    }

    if (!currentChurch.senior_pastor_phone_number?.trim()) {
      errors.senior_pastor_phone_number = 'Pastor phone number is required';
    } else if (!contactNumberFormat.test(currentChurch.senior_pastor_phone_number)) {
      errors.senior_pastor_phone_number = 'Pastor Phone number must be exactly 10 digits';
>>>>>>> 9d8938c (latest code pushed to git)
    }

    return errors;
  };

  // const validateForm = () => {
  //   const errors = {};
  //   const nameFormat = /^[a-zA-Z][a-zA-Z\s.]*$/;

  //   // Name validation
  //   if (!currentChurch.name?.trim()) {
  //     errors.name = 'Name is required';
  //   } else if (!nameFormat.test(currentChurch.name)) {
  //     errors.name = 'Name can only contain letters, spaces, and dots';
  //   } else if (currentChurch.name.startsWith('.') || currentChurch.name.endsWith('.')) {
  //     errors.name = 'Name cannot start or end with a dot';
  //   }

  //   // Address validation
  //   if (!currentChurch.address?.trim()) {
  //     errors.address = 'Address is required';
  //   }

  //   // City/Suburb validation
  //   if (!currentChurch.city?.trim()) {
  //     errors.city = 'Suburb is required';
  //   } else if (!/^[a-zA-Z\s]+$/.test(currentChurch.city)) {
  //     errors.city = 'Suburb can only contain letters and spaces';
  //   }

  //   return errors;
  // };

  const handleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value, field);
    setCurrentChurch((prev) => ({
      ...prev,
      [field]: sanitizedValue
    }));

<<<<<<< HEAD
    // Clear the specific field error when user starts typing
=======
>>>>>>> 9d8938c (latest code pushed to git)
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
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload = {
      name: currentChurch.name.trim(),
      senior_pastor_name: currentChurch.senior_pastor_name.trim(),
      senior_pastor_phone_number: currentChurch.senior_pastor_phone_number.trim(),
      address: currentChurch.address.trim(),
      city: currentChurch.city.trim(),
      contact_no: currentChurch.contact_no.trim(),
      state: currentChurch.state.trim(),
      country: currentChurch.country.trim()
    };

    if (currentChurch.api_key?.trim()) {
      payload.api_key = currentChurch.api_key.trim();
    }

    try {
      if (modalType === 'Save') {
<<<<<<< HEAD
        await axios.post(`${apiBaseUrl}/church/add`, payload);
        toast.success('Church added successfully');
=======
        const response = await axios.post(`${apiBaseUrl}/church/add`, payload);
        if (response.data) {
          // Ensure the new church object matches the expected structure
          const newChurch = {
            ...response.data,
            name: response.data.name || payload.name, // Fallback to payload if API doesn't return it
            address: response.data.address || payload.address,
            city: response.data.city || payload.city,
            created_at: response.data.created_at || new Date().toISOString() // Add timestamp if missing
          };
          setChurches((prevChurches) => [newChurch, ...prevChurches]);
          toast.success('Church added successfully');
        }
>>>>>>> 9d8938c (latest code pushed to git)
      } else {
        const originalChurch = churches.find((c) => c._id === currentChurch._id);
        const changedFields = Object.keys(payload).reduce((acc, key) => {
          if (payload[key] !== originalChurch[key]) {
            acc[key] = payload[key];
          }
          return acc;
        }, {});

        if (Object.keys(changedFields).length > 0) {
          await axios.patch(`${apiBaseUrl}/church/edit/${currentChurch._id}`, changedFields);
          toast.success('Church updated successfully');
<<<<<<< HEAD
=======
          await fetchChurches(); // Refetch to maintain sorting
>>>>>>> 9d8938c (latest code pushed to git)
        } else {
          toast.info('No changes detected');
          setShowModal(false);
          return;
        }
      }

      setShowModal(false);
      setCurrentChurch({
        name: '',
        senior_pastor_name: '',
        senior_pastor_phone_number: '',

        address: '',
        city: '',
        state: '',
        country: '',
        contact_no: '',
        senior_pastor_name: '',
        senior_pastor_phone_number: '',
        api_key: ''
      });
      setValidationErrors({});
      setPage(1); // Reset to first page after adding/updating
    } catch (err) {
      toast.error(err.message || `Error during ${modalType.toLowerCase()} operation`);
    }
  };

  // Add pagination function
  const getPaginatedChurches = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return churches.slice(startIndex, endIndex).map((church, index) => ({
      ...church,
      serialNumber: startIndex + index + 1
    }));
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(churches.length / ITEMS_PER_PAGE);

  const getTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
<<<<<<< HEAD
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
=======
      '& fieldset': { borderColor: '#231f20' },
      '&:hover fieldset': { borderColor: '#231f20' },
      '&.Mui-focused fieldset': { borderColor: '#231f20' }
    },
    '& .MuiInputLabel-root': { color: '#231f20' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' }
>>>>>>> 9d8938c (latest code pushed to git)
  };

  return (
    <React.Fragment>
      <ToastContainer />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
<<<<<<< HEAD
            {/* Add Button Container */}
=======
>>>>>>> 9d8938c (latest code pushed to git)
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
                onClick={handleAdd}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  mb: { xs: 2, sm: 0 },
                  backgroundColor: '#231f20'
                }}
              >
                Add New Church
              </Button>
            </Box>

            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              {error && <Typography color="error">{error}</Typography>}
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: 'auto',
                  '& .MuiTable-root': { minWidth: { xs: '100%', sm: 650 } }
                }}
              >
                <Table>
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
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Name</th>
                      <th
                        style={{
                          padding: theme.spacing(isMobile ? 1 : 2),
                          display: isMobile ? 'none' : 'table-cell'
                        }}
                      >
                        Address
                      </th>
                      <th
                        style={{
                          padding: theme.spacing(isMobile ? 1 : 2),
                          display: isTablet ? 'none' : 'table-cell'
                        }}
                      >
                        Suburb
                      </th>
                      <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
<<<<<<< HEAD
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
                              Loading stafff members...
=======
                        <td colSpan={5} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <CircularProgress
                              size={40}
                              sx={{ color: '#231f20', '& .MuiCircularProgress-svg': { color: '#231f20' } }}
                            />
                            <Typography variant="body1" color="#231f20">
                              Loading churches...
>>>>>>> 9d8938c (latest code pushed to git)
                            </Typography>
                          </Box>
                        </td>
                      </tr>
<<<<<<< HEAD
                    ) : churches.length > 0 ? (
                      churches.map((church, index) => (
                        <tr key={church._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
=======
                    ) : getPaginatedChurches().length > 0 ? (
                      getPaginatedChurches().map((church) => (
                        <tr key={church._id} style={{ backgroundColor: church.serialNumber % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
>>>>>>> 9d8938c (latest code pushed to git)
                          <td
                            style={{
                              padding: theme.spacing(isMobile ? 1 : 2),
                              display: isMobile ? 'none' : 'table-cell'
                            }}
                          >
<<<<<<< HEAD
                            {index + 1}
                          </td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{church.name}</td>
=======
                            {church.serialNumber}
                          </td>
                          <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{church.name || 'N/A'}</td>
>>>>>>> 9d8938c (latest code pushed to git)
                          <td
                            style={{
                              padding: theme.spacing(isMobile ? 1 : 2),
                              display: isMobile ? 'none' : 'table-cell'
                            }}
                          >
<<<<<<< HEAD
                            {church.address}
=======
                            {church.address || 'N/A'}
>>>>>>> 9d8938c (latest code pushed to git)
                          </td>
                          <td
                            style={{
                              padding: theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell'
                            }}
                          >
<<<<<<< HEAD
                            {church.city}
=======
                            {church.city || 'N/A'}
>>>>>>> 9d8938c (latest code pushed to git)
                          </td>
                          <td>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { xs: '80px', sm: 'auto' } }}>
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
                                  '&.MuiButton-root': { minHeight: '24px' }
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(church._id)}
                                className="bg-b"
                                sx={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  minWidth: '60px',
                                  marginLeft: { xs: 0, sm: '2px' },
                                  marginBottom: '3px',
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
                        <td colSpan={5} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
                          No churches available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {/* Pagination - only show if more than ITEMS_PER_PAGE records */}
                {churches.length > ITEMS_PER_PAGE && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': { color: '#231f20' },
                        '& .Mui-selected': { backgroundColor: '#231f20 !important', color: 'white !important' }
                      }}
                    />
                  </Box>
                )}
              </TableContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

<<<<<<< HEAD
      {/* Modal for Add/Edit */}
=======
>>>>>>> 9d8938c (latest code pushed to git)
      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{modalType === 'Save' ? 'Add Church' : 'Edit Church'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              sx={getTextFieldStyles}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!validationErrors.address}
              helperText={validationErrors.address}
              sx={getTextFieldStyles}
              multiline
              rows={3}
            />
            <TextField
              label="Contact No"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.contact_no}
              onChange={(e) => handleInputChange('contact_no', e.target.value)}
              error={!!validationErrors.contact_no}
              helperText={validationErrors.contact_no}
              sx={getTextFieldStyles}
            />
<<<<<<< HEAD

=======
>>>>>>> 9d8938c (latest code pushed to git)
            <TextField
              label="Senior Pastor Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.senior_pastor_name}
              onChange={(e) => handleInputChange('senior_pastor_name', e.target.value)}
              error={!!validationErrors.senior_pastor_name}
              helperText={validationErrors.senior_pastor_name}
              sx={getTextFieldStyles}
            />
            <TextField
<<<<<<< HEAD
              label="Senior Paster Phone Number"
=======
              label="Senior Pastor Phone Number"
>>>>>>> 9d8938c (latest code pushed to git)
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.senior_pastor_phone_number}
              onChange={(e) => handleInputChange('senior_pastor_phone_number', e.target.value)}
              error={!!validationErrors.senior_pastor_phone_number}
              helperText={validationErrors.senior_pastor_phone_number}
              sx={getTextFieldStyles}
            />
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={!!validationErrors.state}
              helperText={validationErrors.state}
              sx={getTextFieldStyles}
            />
<<<<<<< HEAD

=======
>>>>>>> 9d8938c (latest code pushed to git)
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              error={!!validationErrors.country}
              helperText={validationErrors.country}
              sx={getTextFieldStyles}
            />
<<<<<<< HEAD

=======
>>>>>>> 9d8938c (latest code pushed to git)
            <TextField
              label="Suburb"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={!!validationErrors.city}
              helperText={validationErrors.city}
              sx={getTextFieldStyles}
            />
<<<<<<< HEAD

            {/* <TextField
              label="Microsoft Api Key"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentChurch.api_key}
              onChange={(e) => handleInputChange('api_key', e.target.value)}
              sx={getTextFieldStyles}
            /> */}

=======
>>>>>>> 9d8938c (latest code pushed to git)
            <DialogActions>
              <Button onClick={() => setShowModal(false)} variant="outlined" sx={{ color: '#231f20', borderColor: '#231f20' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#231f20', color: 'white' }}>
                {modalType}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Church;

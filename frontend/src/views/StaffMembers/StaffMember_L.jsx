// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   Card,
//   Table,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TableContainer,
//   Paper,
//   DialogActions,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Typography,
//   Box,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   CircularProgress
// } from '@mui/material';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './style.css';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { IconButton } from '@mui/material';

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// const StaffMember = () => {
//   const theme = useTheme();

//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [churches, setChurches] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'Add' or 'Edit'
//   const [currentUser, setCurrentUser] = useState({}); // To hold data of user being edited
//   const [validationErrors, setValidationErrors] = useState({}); // To hold validation errors

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUsers();
//       await fetchChurches();
//     };

//     fetchData();
//   }, []);
//   // Fetch users from the API
//   // useEffect(() => {

//   const fetchUsers = async () => {
//     setIsLoading(true);

//     try {
//       const userType = localStorage.getItem('userType');
//       const churchId = localStorage.getItem('churchId');
//       const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);

//       const filteredUsers = response.data
//         .filter((user) => {
//           if (userType === '1') 
//             {
//             // For superadmin: show all type 4 users who have a valid churchId
//             return user.type === '3' && user.churchId && user.churchId._id;
//             // return user.type === '3';

//           }
//            else if (userType === '2') 
//             {
//             // For admin: show type 4 users only from their church
//             return user.type === '3' && user.churchId && user.churchId._id === churchId;
//           } 
//           else {
//             // For other users: show type 4 users only from their church
//             return user.type === '3' && user.churchId && user.churchId._id === churchId;
//           }
//         })
//         .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//       setUsers(filteredUsers);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       toast.error(err.message || 'Error fetching users');
//     }
//     finally {
//       setIsLoading(false); // Set loading to false after fetching (whether successful or not)
//     }
//   };
//   // const fetchUsers = async () => {
//   //   try {
//   //     // Get userType and churchId from localStorage
//   //     const userType = localStorage.getItem('userType');
//   //     const churchId = localStorage.getItem('churchId');

//   //     // Fetch users data from the API
//   //     const response = await axios.get(`${apiBaseUrl}/user/fetchAll`);
//   // // console.log(response)
//   //     // Filter users based on userType
//   //     const filteredUsers = response.data.filter(user => {
//   //     console.log('Filtered users Uper:', filteredUsers);

//   //       if (userType === "1") {
//   //         // If userType is 1, filter by type without considering churchId
//   //         return user.type === "3";
//   //       } else {
//   //         // Otherwise, filter by both type and churchId
//   //         return user.type === "3" && user.churchId?._id === churchId;
//   //       }
//   //     });

//   //     console.log('Filtered users:', filteredUsers);

//   //     // Set the filtered users
//   //     setUsers(filteredUsers);
//   //   } catch (err) {
//   //     console.error('Error fetching users:', err);
//   //     toast.error(err.message || "Error fetching Staff members");
//   //   }
//   // };

//   // Fetch church names
//   const fetchChurches = async () => {
//     try {
//       const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
//       setChurches(response.data); // Assuming the response is an array of church names
//     } catch (err) {
//       toast.error(err.message || 'Error fetching churches');
//     }
//   };

//   //   fetchUsers();
//   //   fetchChurches();
//   // }, []);

//   // Handle Delete
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this Staff member?')) {
//       try {
//         await axios.delete(`${apiBaseUrl}/user/delete/${id}`);
//         setUsers(users.filter((user) => user._id !== id));
//         toast.success('Staff member deleted successfully');
//       } catch (err) {
//         toast.error(err.message || 'Error deleting Staff member');
//       }
//     }
//   };

//   // Handle Add Button Click
//   // const handleAdd = () => {
//   //   setModalType('Save');
//   //   const userType = localStorage.getItem('userType'); // Retrieve user type from localStorage
//   //   setCurrentUser({
//   //     type: userType === '2' ? '2' : '3' // Default user type based on localStorage
//   //   });
//   //   setShowModal(true);
//   //   setError(null);  // Clear previous errors
//   //   setValidationErrors({});  // Clear previous validation errors
//   // };

//   // Handle Edit Button Click
//   const handleEdit = (user) => {
//     setModalType('Update');
//     setCurrentUser({
//       ...user,
//       churchId: user.churchId?._id || '' // Ensure churchId is populated
//     });
//     setShowModal(true);
//     setError(null); // Clear previous errors
//     setValidationErrors({});
//   };

//   // Validate form fields
//   const validateForm = () => {
//     const errors = {};
//     const specialCharRegex = /[^a-zA-Z0-9\s]/; // Regex to match special characters
//     const whitespaceRegex = /^\s*$/; // Regex to match whitespace
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to match valid email format

//     if (!currentUser.firstName?.trim()) {
//       errors.firstName = 'First name is required.';
//     } else if (currentUser.firstName.trim().length < 3) {
//       errors.firstName = 'First name should be at least 3 characters.';
//     } else if (specialCharRegex.test(currentUser.firstName)) {
//       errors.firstName = 'First name should only contain letters.';
//     }

//     // Last Name validation - Optional but validate if provided
//     if (currentUser.lastName?.trim()) {
//       if (currentUser.lastName.trim().length < 3) {
//         errors.lastName = 'Last name should be at least 3 characters.';
//       } else if (specialCharRegex.test(currentUser.lastName)) {
//         errors.lastName = 'Last name should only contain letters.';
//       }
//     }

//     if (!currentUser.email) {
//       errors.email = 'Email is required.';
//     } else if (!emailRegex.test(currentUser.email)) {
//       errors.email = 'Email format is invalid.';
//     }

//     if (!currentUser.phone) {
//       errors.phone = 'Phone is required.';
//     } else if (!/^\d{10}$/.test(currentUser.phone)) {
//       errors.phone = 'Phone number must be exactly 10 digits.';
//     }

//     if (modalType === 'Save' && !currentUser.password) {
//       errors.password = 'Password is required.';
//     }
//     if (modalType === 'Save') {
//       // Only validate password for new users
//       if (!currentUser.password) {
//         errors.password = 'Password is required.';
//       } else if (currentUser.password.length < 6) {
//         errors.password = 'Password must be at least 6 characters long.';
//       }
//     }

//     if (!currentUser.suburb) {
//       errors.suburb = 'Suburb is required.';
//     } else if (specialCharRegex.test(currentUser.suburb) || whitespaceRegex.test(currentUser.suburb)) {
//       errors.suburb = 'Suburb must not contain special characters or be empty.';
//     }

//     // In validateForm function, modify the churchId validation:
//     if (userType === '1' && !currentUser.churchId) {
//       errors.churchId = 'Church Name is required.';
//     }
//     return errors;
//   };

//   // Handle form submission for both Add and Edit
//   // const handleFormSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const errors = validateForm();
//   //   if (Object.keys(errors).length > 0) {
//   //     setValidationErrors(errors); // Set validation errors if any
//   //     return;
//   //   }

//   //   try {
//   //     const userToSave = { ...currentUser, type: '3' };  // Ensure user type is 2

//   //     if (modalType === 'Save') {
//   //       const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
//   //       setUsers([...users, { ...userToSave, _id: response.data._id }]); // Add to users state
//   //       window.alert("Staff member added successfully");
//   //     } else {
//   //       await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
//   //       setUsers(users.map(user => user._id === currentUser._id ? userToSave : user)); // Update in users state
//   //       window.alert("Staff member updated successfully");
//   //     }
//   //     setShowModal(false);
//   //     setCurrentUser({});
//   //   } catch (err) {
//   //     if (err.response && err.response.data && err.response.data.error) {
//   //       setError(err.response.data.error); // Set the specific API error message
//   //     } else {
//   //       setError(err.message || `Error during ${modalType.toLowerCase()} operation`);
//   //     }
//   //   }
//   // };

//   const handleAdd = () => {
//     setModalType('Save');
//     const userType = localStorage.getItem('userType');
//     const churchIdFromStorage = localStorage.getItem('churchId');

//     // Set initial user data based on user type
//     setCurrentUser({
//       type: '3', // Always set type to 3 for staff members
//       churchId: userType === '2' ? churchIdFromStorage : '' // Set churchId for admin users
//     });

//     setShowModal(true);
//     setError(null);
//     setValidationErrors({});
//   };

//   // Handle form submission
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors);
  //     return;
  //   }

  //   try {
  //     const userType = localStorage.getItem('userType');
  //     const churchIdFromStorage = localStorage.getItem('churchId');

  //     let userToSave = {
  //       ...currentUser,
  //       type: '3' // Always set type to 3 for staff members
  //     };

  //     // If user is admin (type 2), always use their churchId
  //     if (userType === '2') {
  //       userToSave.churchId = churchIdFromStorage;
  //     }
  //     // For superadmin (type 1), use the selected churchId from the form
  //     else if (userType === '1') {
  //       userToSave.churchId = currentUser.churchId;
  //     }

  //     if (modalType === 'Save') {
  //       // Ensure password exists for new users
  //       if (!userToSave.password) {
  //         userToSave.password = Math.random().toString(36).slice(-8);
  //       }

  //       const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
  //       if (response.data) {
  //         await fetchUsers();
  //         toast.success('Staff member added successfully');
  //       }
  //     } else {
  //       // For update, remove password if not changed
  //       if (!userToSave.password) {
  //         delete userToSave.password;
  //       }
  //       const response = await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
  //       if (response.data) {
  //         await fetchUsers();
  //         toast.success('Staff member updated successfully');
  //       }
  //     }

  //     setValidationErrors({});
  //     setError(null);
  //     setCurrentUser({});
  //     setShowModal(false);
  //   } catch (err) {
  //     const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
  //     setError(apiError);
  //     toast.error(apiError || `Error during ${modalType.toLowerCase()} operation`);
  //     console.error('Error details:', err);
  //   }
  // };

//   // Handle input change
//   const handleInputChange = (field, value) => {
//     setCurrentUser((prevState) => ({
//       ...prevState,
//       [field]: value
//     }));
//   };
//   const userType = localStorage.getItem('userType'); // Define userType variable here

//   return (
//     <React.Fragment>
//       <ToastContainer />

//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
//             {/* Add Button Container */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 p: { xs: 1, sm: 2 }
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className="bg-b"
//                 onClick={handleAdd}
//                 sx={{
//                   width: { xs: '100%', sm: 'auto' },
//                   mb: { xs: 2, sm: 0 }
//                 }}
//               >
//                 Add New Staff member
//               </Button>
//             </Box>

//             {/* Table Container */}
//             <TableContainer
//               component={Paper}
//               sx={{
//                 overflowX: 'auto',
//                 p: { xs: 1, sm: 2, md: 3 }
//               }}
//             >
//               <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
//                 <thead>
//                   <tr>
//                     <th
//                       style={{
//                         padding: theme.spacing(isMobile ? 1 : 2),
//                         display: isMobile ? 'none' : 'table-cell'
//                       }}
//                     >
//                       Sr. No
//                     </th>
//                     <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>First Name</th>
//                     <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Last Name</th>
//                     <th
//                       style={{
//                         padding: theme.spacing(isMobile ? 1 : 2),
//                         display: isMobile ? 'none' : 'table-cell'
//                       }}
//                     >
//                       Email
//                     </th>
//                     <th
//                       style={{
//                         padding: theme.spacing(isMobile ? 1 : 2),
//                         display: isMobile ? 'none' : 'table-cell'
//                       }}
//                     >
//                       Phone
//                     </th>
//                     <th
//                       style={{
//                         padding: theme.spacing(isMobile ? 1 : 2),
//                         display: isTablet ? 'none' : 'table-cell'
//                       }}
//                     >
//                       Suburb
//                     </th>
//                     <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Church Name</th>
//                     <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>

//                {isLoading ? (
//                     <tr>
//                       <td colSpan={8} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                           <CircularProgress
//                             size={40}
//                             sx={{
//                               color: '#231f20',
//                               '& .MuiCircularProgress-svg': {
//                                 color: '#231f20'
//                               }
//                             }}
//                           />
//                           <Typography variant="body1" color="#231f20">
//                             Loading stafff members...
//                           </Typography>
//                         </Box>
//                       </td>
//                     </tr>
//                   ) :
//                   users.length > 0 ? (
//                     users.map((user, index) => (
//                       <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
//                         <td
//                           style={{
//                             padding: theme.spacing(isMobile ? 1 : 2),
//                             display: isMobile ? 'none' : 'table-cell'
//                           }}
//                         >
//                           {index + 1}
//                         </td>
//                         <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.firstName}</td>
//                         <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.lastName}</td>
//                         <td
//                           style={{
//                             padding: theme.spacing(isMobile ? 1 : 2),
//                             display: isMobile ? 'none' : 'table-cell'
//                           }}
//                         >
//                           {user.email}
//                         </td>
//                         <td
//                           style={{
//                             padding: theme.spacing(isMobile ? 1 : 2),
//                             display: isMobile ? 'none' : 'table-cell'
//                           }}
//                         >
//                           {user.phone}
//                         </td>
//                         <td
//                           style={{
//                             padding: theme.spacing(isMobile ? 1 : 2),
//                             display: isTablet ? 'none' : 'table-cell'
//                           }}
//                         >
//                           {user.suburb}
//                         </td>
//                         <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.churchId?.name || 'N/A'}</td>
//                         <td>
//                           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { xs: '80px', sm: 'auto' } }}>
//                             <Button
//                               variant="contained"
//                               color="success"
//                               size="small"
//                               className="bg-b"
//                               onClick={() => handleEdit(user)}
//                               sx={{
//                                 fontSize: '11px',
//                                 padding: '4px 8px',
//                                 minWidth: '60px',
//                                 marginBottom: '3px',
//                                 '&.MuiButton-root': {
//                                   minHeight: '24px'
//                                 }
//                               }}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               variant="contained"
//                               color="error"
//                               size="small"
//                               className="bg-b"
//                               onClick={() => handleDelete(user._id)}
//                               sx={{
//                                 fontSize: '11px',
//                                 padding: '4px 8px',
//                                 minWidth: '60px',
//                                 marginLeft: '2px',
//                                 marginBottom: '3px',
//                                 '&.MuiButton-root': {
//                                   minHeight: '24px'
//                                 }
//                               }}
//                             >
//                               Delete
//                             </Button>
//                           </Stack>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={8} style={{ textAlign: 'center', padding: theme.spacing(2) }}>
//                         No Staff member available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </TableContainer>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Modal for Add/Edit */}
//       <Dialog open={showModal} onClose={() => setShowModal(false)}>
//         <DialogTitle>{modalType === 'Save' ? 'Add Staff Member' : 'Edit Staff Member'}</DialogTitle>
//         <DialogContent>
//           <form onSubmit={handleFormSubmit}>
//             <TextField
//               label="First Name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={currentUser.firstName || ''}
//               onChange={(e) => handleInputChange('firstName', e.target.value)}
//               error={!!validationErrors.firstName}
//               helperText={validationErrors.firstName}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#231f20'
//                   }
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#231f20' // default label color
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#231f20' // label color when focused
//                 }
//               }}
//             />

//             <TextField
//               label="Last Name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={currentUser.lastName || ''}
//               onChange={(e) => handleInputChange('lastName', e.target.value)}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#231f20'
//                   }
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#231f20' // default label color
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#231f20' // label color when focused
//                 }
//               }}
//               error={!!validationErrors.lastName}
//               helperText={validationErrors.lastName}
//             />
//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={currentUser.email || ''}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               disabled={modalType === 'Update'} // This will disable the field only when editing
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#231f20'
//                   }
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#231f20' // default label color
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#231f20' // label color when focused
//                 }
//               }}
//               error={!!validationErrors.email}
//               helperText={validationErrors.email}
//             />

//             {modalType === 'Save' && (
//               <TextField
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 value={currentUser.password || ''}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                       sx={{ color: '#231f20' }}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   )
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: '#231f20'
//                     },
//                     '&:hover fieldset': {
//                       borderColor: '#231f20'
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#231f20'
//                     }
//                   },
//                   '& .MuiInputLabel-root': {
//                     color: '#231f20'
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#231f20'
//                   }
//                 }}
//                 error={!!validationErrors.password}
//                 helperText={validationErrors.password}
//               />
//             )}
//             {error && <Typography color="error">{error}</Typography>}
//             <TextField
//               label="Phone"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={currentUser.phone || ''}
//               onChange={(e) => handleInputChange('phone', e.target.value)}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#231f20'
//                   }
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#231f20' // default label color
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#231f20' // label color when focused
//                 }
//               }}
//               error={!!validationErrors.phone}
//               helperText={validationErrors.phone}
//             />

//             {userType !== '2' && (
//               <FormControl
//                 fullWidth
//                 margin="normal"
//                 error={!!validationErrors.churchId}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: '#231f20'
//                     },
//                     '&:hover fieldset': {
//                       borderColor: '#231f20'
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#231f20'
//                     }
//                   },
//                   '& .MuiInputLabel-root': {
//                     color: '#231f20' // default label color
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#231f20' // label color when focused
//                   }
//                 }}
//               >
//                 <InputLabel id="formChurchId-label">Church Name</InputLabel>
//                 <Select
//                   labelId="formChurchId-label"
//                   label="Church Name"
//                   value={currentUser.churchId || ''}
//                   onChange={(e) => handleInputChange('churchId', e.target.value)}
//                 >
//                   <MenuItem value="">
//                     <em>Select Church</em>
//                   </MenuItem>
//                   {churches.map((church) => (
//                     <MenuItem key={church._id} value={church._id}>
//                       {church.name}
//                     </MenuItem>
//                   ))}
//                 </Select>

//                 {validationErrors.churchId && (
//                   <Typography color="error" fontSize="0.75rem" style={{ marginLeft: '14px' }}>
//                     {validationErrors.churchId}
//                   </Typography>
//                 )}
//               </FormControl>
//             )}

//             <TextField
//               label="Suburb"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={currentUser.suburb || ''}
//               onChange={(e) => handleInputChange('suburb', e.target.value)}
//               error={!!validationErrors.suburb}
//               helperText={validationErrors.suburb}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#231f20'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#231f20'
//                   }
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#231f20' // default label color
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#231f20' // label color when focused
//                 }
//               }}
//             />

//             <DialogActions>
//               <Button onClick={() => setShowModal(false)} variant="outlined" color="secondary">
//                 Cancel
//               </Button>
//               <Button type="submit" variant="contained" className="bg-b" color="primary">
//                 {modalType}
//               </Button>
//             </DialogActions>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </React.Fragment>
//   );
// };

// export default StaffMember;







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
  TableContainer
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import StaffMemberModal from './StaffMemberModal'; // Import the new modal component

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StaffMember = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [churches, setChurches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'Save' or 'Update'
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
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

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
        setUsers(users.filter((user) => user._id !== id));
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
      type: '3', // Always set type to 3 for staff members
      churchId: userType === '2' ? churchIdFromStorage : '' // Set churchId for admin users
    });

    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  const handleEdit = (user) => {
    setModalType('Update');
    setCurrentUser({
      ...user,
      churchId: user.churchId?._id || '' // Ensure churchId is populated
    });
    setShowModal(true);
    setError(null);
    setValidationErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    const specialCharRegex = /[^a-zA-Z0-9\s]/; // Regex to match special characters
    const whitespaceRegex = /^\s*$/; // Regex to match whitespace
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to match valid email format

    if (!currentUser.firstName?.trim()) {
      errors.firstName = 'First name is required.';
    } else if (currentUser.firstName.trim().length < 3) {
      errors.firstName = 'First name should be at least 3 characters.';
    } else if (specialCharRegex.test(currentUser.firstName)) {
      errors.firstName = 'First name should only contain letters.';
    }

    // Last Name validation - Optional but validate if provided
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
      // Only validate password for new users
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
        type: '3' // Always set type to 3 for staff members
      };

      // If user is admin (type 2), always use their churchId
      if (userType === '2') {
        userToSave.churchId = churchIdFromStorage;
      }
      // For superadmin (type 1), use the selected churchId from the form
      else if (userType === '1') {
        userToSave.churchId = currentUser.churchId;
      }

      if (modalType === 'Save') {
        // Ensure password exists for new users
        if (!userToSave.password) {
          userToSave.password = Math.random().toString(36).slice(-8);
        }

        const response = await axios.post(`${apiBaseUrl}/user/add`, userToSave);
        if (response.data) {
          await fetchUsers();
          toast.success('Staff member added successfully');
        }
      } else {
        // For update, remove password if not changed
        if (!userToSave.password) {
          delete userToSave.password;
        }
        const response = await axios.patch(`${apiBaseUrl}/user/edit/${currentUser._id}`, userToSave);
        if (response.data) {
          await fetchUsers();
          toast.success('Staff member updated successfully');
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
  const userType = localStorage.getItem('userType');

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
                  mb: { xs: 2, sm: 0 },
                  backgroundColor: '#231f20',
                  '&:hover': { backgroundColor: '#3d3a3b' }
                }}
              >
                Add New Staff member
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
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>First Name</th>
                    <th style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>Last Name</th>
                    <th
                      style={{
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isMobile ? 'none' : 'table-cell'
                      }}
                    >
                      Phone
                    </th>
                    <th
                      style={{
                        padding: theme.spacing(isMobile ? 1 : 2),
                        display: isTablet ? 'none' : 'table-cell'
                      }}
                    >
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
                            Loading staff members...
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                        <td
                          style={{
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}
                        >
                          {index + 1}
                        </td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.firstName}</td>
                        <td style={{ padding: theme.spacing(isMobile ? 1 : 2) }}>{user.lastName}</td>
                        <td
                          style={{
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}
                        >
                          {user.email}
                        </td>
                        <td
                          style={{
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isMobile ? 'none' : 'table-cell'
                          }}
                        >
                          {user.phone}
                        </td>
                        <td
                          style={{
                            padding: theme.spacing(isMobile ? 1 : 2),
                            display: isTablet ? 'none' : 'table-cell'
                          }}
                        >
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
                                backgroundColor: '#d32f2f',
                                '&:hover': { backgroundColor: '#b71c1c' },
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
                        No Staff member available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Staff Member Modal */}
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

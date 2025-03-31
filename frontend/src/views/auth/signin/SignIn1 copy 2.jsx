import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Container,
  Grid,
  Stack,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Box,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Link 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sidebarLogo from '../../../assets/images/church black.png';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import './style.css';
// Validation schema for signup
const validationSchema = Yup.object().shape({
  // firstName: Yup.string().required('First name is required'),
  // lastName: Yup.string().required('Last name is required'),

  firstName: Yup.string()
    .min(3, 'First name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name should only contain letters')
    .required('First name is required'),
  lastName: Yup.string()
    // .min(3, 'Last name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name should only contain letters'),
    // .required('Last name is required'),
    email: Yup.string()
    .transform(value => value?.trim() || '') // Transform empty strings or strings with only spaces to ''
    .email('Invalid email')
    .required('Email is required')
    .test('no-spaces', 'Email cannot contain spaces', 
      value => value ? !value.includes(' ') : true),
  suburb: Yup.string().required('Suburb is required'),
  phone: Yup.string()
    .matches(/^\d+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Mobile number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  churchId: Yup.string().required('Church selection is required'),
});

const SignupScreen = () => {
  // const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentSignupPage');
    return savedPage ? parseInt(savedPage) : 1;
  });
  

  const [isSignIn, setIsSignIn] = useState(() => {
    const savedState = localStorage.getItem('isSignInState');
    return savedState ? JSON.parse(savedState) : true;
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // useEffect(() => {
  //   localStorage.setItem('isSignInState', JSON.stringify(isSignIn));
  // }, [isSignIn]);
  //  // Add useEffect to handle URL parameters
  //  useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const signup = params.get('signup');
  //   if (signup === 'true') {
  //     setIsSignIn(false);
  //   }
  // }, []);


  // Initialize formData from localStorage
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('signupFormData');
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      suburb: '',
      churchId: '',
      password: '',
      confirmPassword: '',
      attendedBefore: 'Yes',
      faithLevel: 'No faith',
      broughtBy: 'No',
      broughtByName: '',
      termAgreement: false,
      churchNames: [],
    };
  });
   // Save formData to localStorage whenever it changes
   useEffect(() => {
    localStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [formData]);

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentSignupPage', currentPage.toString());
  }, [currentPage]);

  // Save isSignIn state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isSignInState', JSON.stringify(isSignIn));
  }, [isSignIn]);


  const handleSignInStateChange = (newState) => {
    setIsSignIn(newState);
    localStorage.setItem('isSignInState', JSON.stringify(newState));
  };



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  // const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   phone: '',
  //   email: '',
  //   suburb: '',
  //   churchId: '',
  //   password: '',
  //   confirmPassword: '',
  //   attendedBefore: 'Yes',
  //   faithLevel: 'No faith',
  //   broughtBy: 'No',
  //   broughtByName: '',
  //   termAgreement: false,
  //   churchNames: [],
  // });
  const [errors, setErrors] = useState({});
  const [openTermsModal, setOpenTermsModal] = useState(false);

  const handleOpenTermsModal = () => {
    setOpenTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setOpenTermsModal(false);
  };

  const handleConfirmTerms = () => {
    setFormData((prevData) => ({ ...prevData, termAgreement: true }));
    handleCloseTermsModal();
  };

 

  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
        setFormData((prevData) => ({ ...prevData, churchNames: Array.isArray(response.data) ? response.data : [] }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchChurches();
  }, []);

  const validateForm = async (fieldsToValidate) => {
    try {
      const schemaToValidate = Yup.object().shape(
        Object.keys(fieldsToValidate).reduce((acc, field) => {
          acc[field] = validationSchema.fields[field];
          return acc;
        }, {})
      );

      await schemaToValidate.validate(formData, { abortEarly: false });
      return true; // Form is valid
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false; // Form is invalid
    }
  };

  // const handleInputChange = (field, value) => {
  //   setFormData((prevData) => ({ ...prevData, [field]: value }));
  //   setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  // };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      // Remove all spaces and trim for email
      const sanitizedEmail = value.replace(/\s/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: sanitizedEmail
      }));
    } else {
      // Normal handling for other fields
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleNextPage = async () => {
    let fieldsToValidate = {};
    if (currentPage === 1) {
      fieldsToValidate = {
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        suburb: true,
        churchId: true,
        password: true,
        confirmPassword: true,
      };
    }

    const isValid = await validateForm(fieldsToValidate);
    if (isValid) {
      setCurrentPage(currentPage + 1);
    }
  };

  // const handleSubmit = async () => {
  //   let errors = {};

  //   // Check if email is empty
  //   if (!formData.email) {
  //       errors.email = 'Email is required.';
  //   }

  //   // Check if password is empty
  //   if (!formData.password) {
  //       errors.password = 'Password is required.';
  //   }

  //   // If there are any errors, set them in state and stop execution
  //   if (Object.keys(errors).length > 0) {
  //       setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  //       return;
  //   }
  //   if (isSignIn) {
  //     // console.log("is", isSignIn)
  //     const loginData = {
  //       email: formData.email,
  //       password: formData.password,
  //     };
  //     try {
  //       const response = await axios.post(`${apiBaseUrl}/auth/login`, loginData);
  //       const { user } = response.data;
  //       localStorage.setItem('userId', user.id);
  //       localStorage.setItem('firstName', user.firstName);
  //       localStorage.setItem('lastName', user.lastName);
  //       localStorage.setItem('churchId', user.churchId);
  //       localStorage.setItem('userEmail', user.email);
  //       localStorage.setItem('userType', user.type);
  //       navigate('/dashboard');
  //     } 
  //     catch (err) 
  //     {
  //       console.log("Err", err.response.data.error);
  //       alert(err.response.data.error || 'Please enter the correct credentials.');
  //     }
  //   } 
  //   else {
  //     // Handle signup
  //     if (!formData.termAgreement) {
  //       alert('You must agree to the terms and conditions.');
  //       return;
  //     }
  //     const registrationData = {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       phone: formData.phone,
  //       email: formData.email,
  //       suburb: formData.suburb,
  //       churchId: formData.churchId,
  //       password: formData.password,
  //       attendedBefore: formData.attendedBefore,
  //       faithLevel: formData.faithLevel,
  //       termAgreement: formData.termAgreement,
  //       broughtBy: formData.broughtBy === 'Yes' ? formData.broughtByName : formData.broughtBy,
  //       type: "4"
  //     };

  //     try {
  //       await axios.post(`${apiBaseUrl}/user/add`, registrationData);
  //       alert('Your account has been created successfully!');
  //       navigate('/');
  //       setIsSignIn(true); // Switch to sign in mode
  //       setFormData(prev => ({
  //         ...prev,
  //         email: registrationData.email, // Pre-fill the email
  //         password: '', // Clear the password for security
  //       }));
  //     } catch (err) {
  //       alert(err.response.data.error || 'Registration failed');
  //     }
  //   }
  // };
  const handleSubmit = async () => {
    let errors = {};

    // Check if email is empty
    if (!formData.email) {
        errors.email = 'Email is required.';
    }

    // Check if password is empty
    if (!formData.password) {
        errors.password = 'Password is required.';
    }

    // If there are any errors, set them in state and stop execution
    if (Object.keys(errors).length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
        return;
    }

    if (isSignIn) {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };
      try {
        const response = await axios.post(`${apiBaseUrl}/auth/login`, loginData);
        const { user } = response.data;
        localStorage.setItem('userId', user.id);
        localStorage.setItem('firstName', user.firstName);
        localStorage.setItem('lastName', user.lastName);
        localStorage.setItem('churchId', user.churchId);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userType', user.type);
        localStorage.removeItem('isSignInState');
        navigate('/dashboard');
      } 
      catch (err) 
      {
        console.log("Err", err.response.data.error);
        alert(err.response.data.error || 'Please enter the correct credentials.');
      }
    } 
    else {
      // Handle signup
      if (!formData.termAgreement) {
        alert('You must agree to the terms and conditions.');
        return;
      }

      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        suburb: formData.suburb,
        churchId: formData.churchId,
        password: formData.password,
        attendedBefore: formData.attendedBefore,
        faithLevel: formData.faithLevel,
        termAgreement: formData.termAgreement,
        broughtBy: formData.broughtBy === 'Yes' ? formData.broughtByName : formData.broughtBy,
        type: "4"
      };

      try {
        await axios.post(`${apiBaseUrl}/user/add`, registrationData);
        localStorage.removeItem('isSignInState');
        alert('Your account has been created successfully!');
        navigate('/');
        setIsSignIn(true);
        setFormData(prev => ({
          ...prev,
          email: registrationData.email,
          password: '',
        }));
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Registration failed';
        
        // Handle email exists error
        if (errorMessage.toLowerCase().includes('email already exists') || 
            errorMessage.toLowerCase().includes('duplicate') || 
            errorMessage.toLowerCase().includes('email exists')) {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered. Please use a different email.'
          }));
          setCurrentPage(1); // Go back to first page
          // Clear password fields for security
          setFormData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
          }));
        } else {
          // Handle other errors
          alert(errorMessage);
          if (errorMessage.toLowerCase().includes('password')) {
            setCurrentPage(1); // Go back to first page if password-related error
          }
        }
      }
    }
};

  const renderTermsModal = () => (
    <Modal
      open={openTermsModal}
      onClose={handleCloseTermsModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openTermsModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', color: 'black' }}>
          Futures Church (Assemblies of God Paradise inc) ABN 79 020 003 383
        understands that protecting your privacy and confidentiality is fundamental in how we
        care for people.<br/><br/>
          Futures Church (the Church) Like many other organisations must comply with the
          National Privacy Principles contained in the Australian Privacy Act when dealing with
          personal information.<br/><br/>
          This Privacy Policy covers the Church’s treatment of personally identifiable
          information that we collect or hold.
          <br/><br/>
          1. The information we collect<br/><br/>
          We collect information to provide better outcomes to all that attend our events,
          facilities and services. <br/><br/>
          We will only collect personal and sensitive information that is necessary for us to
          carry out these functions and provide these services and programs. The type of
          information we may collect, hold and use, varies depending on the purpose for which
          it is collected but may include (amongst others):  <br/><br/>
          • personal details such as your title, name and date of birth <br/><br/>
          • contact details such as postal address, post code, email, mobile and telephone numbers <br/> <br/>
          • when relevant to our mission, demographic information such as marital status, 
          nationality, education, employment/qualifications and family details  <br/><br/>
          • financial information such as credit card details, donation history and your
          bank details <br/><br/>
          • spouse and family details when you jointly volunteer, register for events, and/
          or register your children for any reason at Futures Church <br/><br/>
          • employee and volunteer data such as qualifications, languages and
          experience <br/><br/>
          • records of your contact with us.<br/><br/>
          • photographs provided by you or taken at Futures Church services or
          events Sensitive/Special Category Personal Information.<br/><br/>
          We may also collect and store sensitive personal information such as: <br/><br/>
          • health information provided during pastoral meetings.<br/><br/>
          • health information to assist attendance at Futures Church services and
          events.<br/><br/>
          • religious information (attendance at services, church events / activities,
          personal faith decisions, baptism etc); <br/><br/>
          • prayer requests.<br/><br/>
          It is important to also note that all services (including various other activities) of
          Futures Church are recorded. Images of the people attending or participating in
          the service (or other activity) may be used and shown in our services, Resources
          and for other promotional purposes and commercial activities. By attending any service (or other activity) you agree to Futures Church using your image and
          personal information in these recordings.<br/><br/>
          2. How we use your information<br/><br/>
          Futures Church will use the personal information we collect for the purpose
          disclosed at the time of collection, or otherwise as set out in this Privacy Policy. We
          will not use your personal information for any other purpose without first seeking your
          consent, unless authorised or required by law. Generally we will only use and
          disclose your personal information as follows:<br/><br/>
          (a) to establish and maintain your involvement with the Church, including
          providing you with newsletters and information on upcoming events<br/><br/>
          (b) to provide the products or services you have requested from the Church<br/><br/>
          (c) to answer your inquiry<br/><br/>
          (d) to register you for events, conferences or promotions<br/><br/>
          (e) to assist us to make the Church’s sites, services and products more
          valuable to our community<br/><br/>
          (f) for direct promotion of products or services and to keep you informed of
          new developments we believe may be of interest to you.<br/><br/>
          (g) to third parties where we have retained those third parties to assist us to
          operate the Church and provide the products or services you have requested,
          such as religious education instructors, catering and event coordinators,
          promotions companies, transport providers, health care providers, website
          hosts and IT consultants, and our professional advisers such as consultants,
          lawyers and accountants. In some circumstances we may need to disclose
          sensitive information about you to third parties as part of the services you
          have requested and<br/><br/>
          (h) to different parts of the Church to enable the development and promotion
          of other products and services and to improve our general ability to assist
          Church attendees and the wider community.<br/><br/>
          Information you provide electronically, including through this website, may be held on
          computers in Futures Churches locations and on servers in Australia.<br/><br/>
          Information you provide in paper form may be transferred to secure virtual systems
          or stored in secure physical filing systems.<br/><br/>
          We will never share, sell, or rent your personal information with third parties for their
          promotional use.<br/><br/>
          3. Access to your information<br/><br/>
          You can make a request to access your personal information that the Church holds
          about you by contacting the Church’s Privacy Officer as set out below. We will
          provide you with access to your personal information unless we are legally
          authorised to refuse your request. We may charge a reasonable amount for
          providing access.<br/><br/>

          If you wish to change personal information that is out of date or inaccurate at any
          time please contact us. After notice from you, we will take reasonable steps to
          correct any of your information which is inaccurate, incomplete or out of date. If you
          wish to have your personal information deleted, please let us know and we will
          delete that information wherever practicable.<br/><br/>

          We may refuse your request to access, amend or delete your personal information in
          certain circumstances. If we do refuse your request, we will provide you with a
          reason for our decision and, in the case of amendment, we will note with your
          personal information that you have disputed its accuracy.<br/><br/>
          4. Security<br/><br/>
          The Church will take reasonable steps to keep secure any personal information
          which we hold and to keep this information accurate and up to date. Personal
          information is stored in a secure server or secure files.<br/><br/>
          The Internet is not a secure method of transmitting information. Accordingly, the
          Church cannot accept responsibility for the security of information you send to or
          receive from us over the Internet or for any unauthorised access or use of that
          information.
          5. Changes to this Privacy Policy<br/><br/>
          The Church may amend this Privacy Policy from time to time by having the amended
          version available at the information counters at the Church or on our website at
          https://futures.church/australia/
            We suggest that you visit our website regularly
          to keep up to date with any changes.<br/><br/>
          6. Contacting us<br/><br/>
          If you would like any further information, or have any queries, problems or
          complaints relating to the Church’s Privacy Policy or our information handling
          practices in general, please contact our Privacy Officer by calling +61 8 8336 0000
          or writing to The Privacy Officer, Influencers Church, 57 Darley Road, Paradise
          SA 5075, AUSTRALIA.

          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmTerms}
            fullWidth className="bg-b"
            sx={{ mt: 2 }}
          >
           I Agree
          </Button>
        </Box>
      </Fade>
    </Modal>
  );


   const renderSignIn = () => (
    <Stack spacing={2.5} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        onBlur={(e) => {
          const cleanEmail = e.target.value.replace(/\s/g, '');
          handleInputChange('email', cleanEmail);
        }}
        error={!!errors.email}
        helperText={errors.email}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#231f20' },
            '&:hover fieldset': { borderColor: '#231f20' },
            '&.Mui-focused fieldset': { borderColor: '#231f20' },
          },
          '& .MuiInputLabel-root': { color: '#231f20' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' },
        }}
      />
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#231f20' },
            '&:hover fieldset': { borderColor: '#231f20' },
            '&.Mui-focused fieldset': { borderColor: '#231f20' },
          },
          '& .MuiInputLabel-root': { color: '#231f20' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' },
        }}
      />
    </Stack>
  );

  const renderSignUpPageOne = () => (
    <Box sx={{ 
      // backgroundColor: "#f4eeee",
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      p: 0
    }}>
      <TextField
        fullWidth
        label="First Name"
        value={formData.firstName}
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
            color: '#231f20',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#231f20',
          },
        }}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
  
      <TextField
        fullWidth
        label="Last Name"
        value={formData.lastName}
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
            color: '#231f20',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#231f20',
          },
        }}
        error={!!errors.lastName}
        helperText={errors.lastName}
      />
  
      <TextField
        fullWidth
        label="Mobile Number"
        value={formData.phone}
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
            color: '#231f20',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#231f20',
          },
        }}
        error={!!errors.phone}
        helperText={errors.phone}
      />
  
      <TextField
        fullWidth
        label="Email Address"
        value={formData.email}
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
            color: '#231f20',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#231f20',
          },
        }}
        error={!!errors.email}
        helperText={errors.email}
      />
  
      <TextField
        fullWidth
        label="Suburb"
        value={formData.suburb}
        onChange={(e) => handleInputChange('suburb', e.target.value)}
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
        error={!!errors.suburb}
        helperText={errors.suburb}
      />
  
  <FormControl 
  fullWidth 
  variant="outlined" 
  margin="normal" 
  error={!!errors.churchId}
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
      }
    },
    '& .MuiInputLabel-root': {
      color: '#231f20',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#231f20',
    },
    // Add this if you want to style the select when opened
    '& .MuiSelect-select:focus': {
      backgroundColor: 'transparent',
    }
  }}
>
  <InputLabel 
    id="formChurchId-label"
    sx={{
      color: '#231f20',
      '&.Mui-focused': {
        color: '#231f20',
      }
    }}
  >
    Church
  </InputLabel>
  <Select
    labelId="formChurchId-label"
    value={formData.churchId}
    onChange={(e) => handleInputChange('churchId', e.target.value)}
    label="Church"
    sx={{
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#231f20',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#231f20',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#231f20',
      },
    }}
  >
    <MenuItem value="">
      <em>Select Church</em>
    </MenuItem>
    {formData.churchNames.map((church) => (
      <MenuItem key={church._id} value={church._id}>
        {church.name}
      </MenuItem>
    ))}
  </Select>
  {errors.churchId && (
    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
      {errors.churchId}
    </Typography>
  )}
</FormControl>
  
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!errors.password}
        helperText={errors.password}
      />
  
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleConfirmPasswordVisibility}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
  
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" className="bg-b" onClick={handleNextPage}>
          Next
        </Button>
      </Box>
    </Box>
  );
  // style={{backgroundColor: "rgb(229 229 229)"}}

  const renderSignUpPageTwo = () => (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <IconButton size="small" color="primary">
                
                </IconButton>
              </Grid>
              <Grid item>
                <Typography sx={{ mt: 2}} style={{textAlign: 'center', marginLeft: '85px', color: 'black'}} variant="h6" color="info" >
                  Get to Know You
                </Typography>
              </Grid>
            </Grid>
          </Grid>
  
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mt: 2}}>
                  Have you been to this church before?
                </Typography>
              </Grid>
              <Grid item xs={12}>
              <Grid container spacing={1}>
  {['Yes', 'No'].map(option => (
    <Grid item key={option} xs={6}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: formData.attendedBefore === option ? '#231f20' : '#fff',
          color: formData.attendedBefore === option ? '#fff' : 'inherit', // Set text color to white for contrast
          '&:hover': {
            backgroundColor: formData.attendedBefore === option ? '#default' : 'default' // Slightly darker on hover
          }
        }}
        onClick={() => handleInputChange('attendedBefore', option)}
      >
        {option}
      </Button>
    </Grid>
  ))}
</Grid>

              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mt: 2}}>
                  Describe your level of faith:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} >
                  {[
                    'No faith',
                    'Uncertain',
                    'Open to faith',
                    'Actively Exploring',
                    'Strong faith',
                  ].map(level => (
                    <Grid item key={level} xs={12} sx={{ mt: 2}}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: formData.faithLevel === level ? '#231f20' : '#fff',
                          color: formData.faithLevel === level ? '#fff' : 'inherit', // Set text color to white for contrast when selected
                          '&:hover': {
                            backgroundColor: formData.faithLevel === level ? '#1b1a1a' : 'default', // Darker shade on hover when selected
                          },
                        }}
                        onClick={() => handleInputChange('faithLevel', level)}
                      >
                        {level}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mt: 2}}>
                  Did someone bring you to church?
                </Typography>
              </Grid>
              <Grid item xs={12}>
              <Grid container spacing={1}>
  {['Yes', 'No'].map(option => (
    <Grid item key={option} xs={6}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: formData.broughtBy === option ? '#231f20' : '#fff',
          color: formData.broughtBy === option ? '#fff' : 'inherit', // Text color set to white for contrast when selected
          '&:hover': {
            backgroundColor: formData.broughtBy === option ? '#1b1a1a' : 'default', // Darker shade on hover when selected
          },
        }}
        onClick={() => handleInputChange('broughtBy', option)}
      >
        {option}
      </Button>
    </Grid>
  ))}
</Grid>

              </Grid>
              {formData.broughtBy === 'Yes' && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        Who brought you?
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Grid container spacing={1}>
                            <Grid item xs={1}>
                              <IconButton size="small" color="primary">
                                {/* <AccountIcon /> */}
                              </IconButton>
                            </Grid>
                            <Grid item xs={11}>
                              <TextField
                                fullWidth
                                variant="standard"
                                value={formData.broughtByName}
                                onChange={event => handleInputChange('broughtByName', event.target.value)}
                                error={errors.firstName}
                                helperText={errors.firstName && 'Error message'}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* ... (rest of the code for page two remains the same) ... */}
      <Grid item xs={12}>
  <Grid container spacing={1} sx={{ mt: 3 }} direction="row" justifyContent="space-between">
    <Grid item>
      <Button
        sx={{
          ms: 10,
          color: '#231f20', // Custom light blue color
          borderColor: '#231f20',
          '&:hover': {
            backgroundColor: '#231f20',
            color: '#fff',
          }
        }}
        variant="outlined" 
        onClick={() => setCurrentPage(1)}
      >
        Prev
      </Button>
    </Grid>
    <Grid item>
      <Button
        sx={{
          // color: '#4dabf5', // Custom light blue color
          borderColor: '#4dabf5',
       
          '&:hover': {
            backgroundColor: '#4dabf5',
            color: '#fff',
          }
        }}
        variant="contained" className="bg-b"
        onClick={() => setCurrentPage(3)}
      >
        Next
      </Button>
    </Grid>
  </Grid>
</Grid>




    </Grid>
  );

  const renderSignUpPageThree = () => (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Typography variant="h5"  style={{color: '#231f20'}} >
          Terms and Conditions
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
        
        By creating an account, you agree to our Terms of Service and Privacy Policy. 
        We're committed to protecting your personal information and ensuring a safe 
        experience within our church community.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Link variant="outlined" color="primary"  style={{color: '#231f20', fontWeight: 'bold'}} onClick={handleOpenTermsModal}>
          Read Our Privacy Policy
        </Link>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.termAgreement} style={{color: '#231f20'}}
              onChange={(e) => handleInputChange('termAgreement', e.target.checked)}
            />
          }
          label="I accept Futures Church will use this information in line with their Privacy Policy"
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} direction="row" justifyContent="space-between">
          <Grid item>
            <Button 
                sx={{
                  // color: '#4dabf5', // Custom light blue color
                  borderColor: '#231f20',
                  '&:hover': {
                    backgroundColor: '#231f20',
                    color: '#fff',
                  }
                }}
              variant="outlined"
              color="primar"
              onClick={() => setCurrentPage(2)}
            >
              Prev
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}   style={{
                backgroundColor: formData.termAgreement ? '#231f20' : '#cccccc', // Gray when disabled
                color: 'white',
                '&:hover': {
                  backgroundColor: formData.termAgreement ? '#3d3d3d' : '#cccccc',
                },
              }}
              disabled={!formData.termAgreement}
            >
              Finish
            </Button>
          </Grid>
        </Grid>
      </Grid>  
    </Grid>
  );

 
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return renderSignUpPageOne();
      case 2:
        return renderSignUpPageTwo();
      case 3:
        return renderSignUpPageThree();
      default:
        return null;
    }
  };
  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15  px' }}>
      <Paper elevation={3} style={{ width: '80%', maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <img 
            src={sidebarLogo} 
            alt="Church Translator" 
            className="b-title" 
            style={{ height: '67px', objectFit: 'contain', paddingTop: '18px' }} 
          />
        
        <Box p={3} style={{ overflowY: 'auto'}} sx={{
          '::-webkit-scrollbar': {
            width: '2px', // Slimmer width for the scrollbar
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#fff', // Color of the scrollbar thumb
            borderRadius: '8px', // Rounded scrollbar thumb
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Darker on hover
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1', // Scrollbar track color
          },
        }}>
    
        <Typography variant="h5" align="center" gutterBottom style={{background: '#231f20',
    padding: '12px', marginBottom: '20px', color: 'white', fontSize: '1.3rem'}}>
       
          {isSignIn ? 'Sign In' : 'Sign Up'}
          {!isSignIn && (
            <Link 
              component="button"
              variant="h6" style={{background: '#231f20', color: 'white'}}
              // onClick={() => setIsSignIn(true)}
              onClick={() => handleSignInStateChange(true)} 
              sx={{ float: 'right', paddingRight: '7px' }}
              
            >
              Sign In
            </Link>
          )}
         </Typography>

        
          {isSignIn ? renderSignIn() : renderPageContent()}
        </Box>
       
        <Box p={2} mt="auto">
  {isSignIn && (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box sx={{ flex: '0 0 66.66%' }}>
        <Typography style={{paddingLeft: '9px'}}>
          Don't have an account?&nbsp;
          <span
            style={{
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: 600,
              color: '#231f20',
              paddingLeft: '9px'
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            // onClick={() => setIsSignIn(!isSignIn)}
            onClick={() => handleSignInStateChange(false)} 
          >
            SIGN UP
          </span>
        </Typography>
      </Box>
      <Box sx={{ flex: '0 0 25%', display: 'flex', justifyContent: 'flex-end' }}>          
        <Button 
          variant="contained" 
          color="primary" 
          style={{
            backgroundColor: '#231f20', 
            color: 'white', 
            width: '80px',
            fontSize: '16px',
            borderRadius: '0px',
            marginRight: '7px'
          }} 
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Box>
    </Box>
  )}
</Box>
      </Paper>
      {renderTermsModal()}
    </Container>


  );
};

export default SignupScreen;





// import React, { useState, useEffect } from 'react';
// import {
//   TextField,
//   Button,
//   Typography,
//   InputAdornment,
//   Container,
//   Grid,
//   IconButton,
//   FormControl,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   InputLabel,
//   Box,
//   Modal,
//   Backdrop,
//   Fade,
//   Paper,
//   Link 
// } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import * as Yup from 'yup';
// import { NavLink, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
// import './style.css';
// // Validation schema for signup
// const validationSchema = Yup.object().shape({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   suburb: Yup.string().required('Suburb is required'),
//   phone: Yup.string()
//     .matches(/^\d+$/, 'Phone number must contain only digits')
//     .min(10, 'Phone number must be at least 10 digits')
//     .required('Mobile number is required'),
//   password: Yup.string()
//     .min(6, 'Password must be at least 6 characters')
//     .required('Password is required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match')
//     .required('Confirm Password is required'),
//   churchId: Yup.string().required('Church selection is required'),
// });

// const SignupScreen = () => {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
// };
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     email: '',
//     suburb: '',
//     churchId: '',
//     password: '',
//     confirmPassword: '',
//     attendedBefore: 'Yes',
//     faithLevel: 'No faith',
//     broughtBy: 'No',
//     broughtByName: '',
//     termAgreement: false,
//     churchNames: [],
//   });
//   const [errors, setErrors] = useState({});
//   const [openTermsModal, setOpenTermsModal] = useState(false);

//   const handleOpenTermsModal = () => {
//     setOpenTermsModal(true);
//   };

//   const handleCloseTermsModal = () => {
//     setOpenTermsModal(false);
//   };

//   const handleConfirmTerms = () => {
//     setFormData((prevData) => ({ ...prevData, termAgreement: true }));
//     handleCloseTermsModal();
//   };

//   useEffect(() => {
//     const fetchChurches = async () => {
//       try {
//         const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
//         setFormData((prevData) => ({ ...prevData, churchNames: Array.isArray(response.data) ? response.data : [] }));
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchChurches();
//   }, []);

//   const validateForm = async (fieldsToValidate) => {
//     try {
//       const schemaToValidate = Yup.object().shape(
//         Object.keys(fieldsToValidate).reduce((acc, field) => {
//           acc[field] = validationSchema.fields[field];
//           return acc;
//         }, {})
//       );

//       await schemaToValidate.validate(formData, { abortEarly: false });
//       return true; // Form is valid
//     } catch (validationErrors) {
//       const newErrors = {};
//       if (validationErrors.inner) {
//         validationErrors.inner.forEach(error => {
//           newErrors[error.path] = error.message;
//         });
//       }
//       setErrors(newErrors);
//       return false; // Form is invalid
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prevData) => ({ ...prevData, [field]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
//   };

//   const handleNextPage = async () => {
//     let fieldsToValidate = {};
//     if (currentPage === 1) {
//       fieldsToValidate = {
//         firstName: true,
//         lastName: true,
//         phone: true,
//         email: true,
//         suburb: true,
//         churchId: true,
//         password: true,
//         confirmPassword: true,
//       };
//     }

//     const isValid = await validateForm(fieldsToValidate);
//     if (isValid) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleSubmit = async () => {
//     let errors = {};

//     // Check if email is empty
//     if (!formData.email) {
//         errors.email = 'Email is required.';
//     }

//     // Check if password is empty
//     if (!formData.password) {
//         errors.password = 'Password is required.';
//     }

//     // If there are any errors, set them in state and stop execution
//     if (Object.keys(errors).length > 0) {
//         setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
//         return;
//     }
//     if (isSignIn) {
//       // console.log("is", isSignIn)
//       const loginData = {
//         email: formData.email,
//         password: formData.password,
//       };
//       try {
//         const response = await axios.post(`${apiBaseUrl}/auth/login`, loginData);
//         const { user } = response.data;
//         localStorage.setItem('userId', user.id);
//         localStorage.setItem('firstName', user.firstName);
//         localStorage.setItem('lastName', user.lastName);
//         localStorage.setItem('churchId', user.churchId);
//         localStorage.setItem('userEmail', user.email);
//         localStorage.setItem('userType', user.type);
//         navigate('/');
//       } 
//       catch (err) 
//       {
//         console.log("Err", err.response.data.error);
//         alert(err.response.data.error || 'Please enter the correct credentials.');
//       }
//     } 
//     else {
//       // Handle signup
//       if (!formData.termAgreement) {
//         alert('You must agree to the terms and conditions.');
//         return;
//       }
//       const registrationData = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phone: formData.phone,
//         email: formData.email,
//         suburb: formData.suburb,
//         churchId: formData.churchId,
//         password: formData.password,
//         attendedBefore: formData.attendedBefore,
//         faithLevel: formData.faithLevel,
//         termAgreement: formData.termAgreement,
//         broughtBy: formData.broughtBy === 'Yes' ? formData.broughtByName : formData.broughtBy,
//         type: "4"
//       };

//       try {
//         await axios.post(`${apiBaseUrl}/user/add`, registrationData);
//         alert('Your account has been created successfully!');
//         navigate('/');
//       } catch (err) {
//         if (err.response?.data?.error === 'Email already exists') {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             email: 'This email is already registered. Please use a different email.'
//           }));
//           setCurrentPage(1); // Take user back to first page to fix email
//         } else {
//           alert(err.response?.data?.error || 'Registration failed');
//         }
//         // alert(err.response.data.error || 'Registration failed');
//       }
//     }
//   };

//   const renderTermsModal = () => (
//     <Modal
//       open={openTermsModal}
//       onClose={handleCloseTermsModal}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{
//         timeout: 500,
//       }}
//     >
//       <Fade in={openTermsModal}>
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           border: '2px solid #000',
//           boxShadow: 24,
//           p: 4,
//         }}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Terms and Conditions
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', color: 'black' }}>
//           Futures Church (Assemblies of God Paradise inc) ABN 79 020 003 383
//         understands that protecting your privacy and confidentiality is fundamental in how we
//         care for people.<br/><br/>
//           Futures Church (the Church) Like many other organisations must comply with the
//           National Privacy Principles contained in the Australian Privacy Act when dealing with
//           personal information.<br/><br/>
//           This Privacy Policy covers the Church’s treatment of personally identifiable
//           information that we collect or hold.
//           <br/><br/>
//           1. The information we collect<br/><br/>
//           We collect information to provide better outcomes to all that attend our events,
//           facilities and services. <br/><br/>
//           We will only collect personal and sensitive information that is necessary for us to
//           carry out these functions and provide these services and programs. The type of
//           information we may collect, hold and use, varies depending on the purpose for which
//           it is collected but may include (amongst others):  <br/><br/>
//           • personal details such as your title, name and date of birth <br/><br/>
//           • contact details such as postal address, post code, email, mobile and telephone numbers <br/> <br/>
//           • when relevant to our mission, demographic information such as marital status, 
//           nationality, education, employment/qualifications and family details  <br/><br/>
//           • financial information such as credit card details, donation history and your
//           bank details <br/><br/>
//           • spouse and family details when you jointly volunteer, register for events, and/
//           or register your children for any reason at Futures Church <br/><br/>
//           • employee and volunteer data such as qualifications, languages and
//           experience <br/><br/>
//           • records of your contact with us.<br/><br/>
//           • photographs provided by you or taken at Futures Church services or
//           events Sensitive/Special Category Personal Information.<br/><br/>
//           We may also collect and store sensitive personal information such as: <br/><br/>
//           • health information provided during pastoral meetings.<br/><br/>
//           • health information to assist attendance at Futures Church services and
//           events.<br/><br/>
//           • religious information (attendance at services, church events / activities,
//           personal faith decisions, baptism etc); <br/><br/>
//           • prayer requests.<br/><br/>
//           It is important to also note that all services (including various other activities) of
//           Futures Church are recorded. Images of the people attending or participating in
//           the service (or other activity) may be used and shown in our services, Resources
//           and for other promotional purposes and commercial activities. By attending any service (or other activity) you agree to Futures Church using your image and
//           personal information in these recordings.<br/><br/>
//           2. How we use your information<br/><br/>
//           Futures Church will use the personal information we collect for the purpose
//           disclosed at the time of collection, or otherwise as set out in this Privacy Policy. We
//           will not use your personal information for any other purpose without first seeking your
//           consent, unless authorised or required by law. Generally we will only use and
//           disclose your personal information as follows:<br/><br/>
//           (a) to establish and maintain your involvement with the Church, including
//           providing you with newsletters and information on upcoming events<br/><br/>
//           (b) to provide the products or services you have requested from the Church<br/><br/>
//           (c) to answer your inquiry<br/><br/>
//           (d) to register you for events, conferences or promotions<br/><br/>
//           (e) to assist us to make the Church’s sites, services and products more
//           valuable to our community<br/><br/>
//           (f) for direct promotion of products or services and to keep you informed of
//           new developments we believe may be of interest to you.<br/><br/>
//           (g) to third parties where we have retained those third parties to assist us to
//           operate the Church and provide the products or services you have requested,
//           such as religious education instructors, catering and event coordinators,
//           promotions companies, transport providers, health care providers, website
//           hosts and IT consultants, and our professional advisers such as consultants,
//           lawyers and accountants. In some circumstances we may need to disclose
//           sensitive information about you to third parties as part of the services you
//           have requested and<br/><br/>
//           (h) to different parts of the Church to enable the development and promotion
//           of other products and services and to improve our general ability to assist
//           Church attendees and the wider community.<br/><br/>
//           Information you provide electronically, including through this website, may be held on
//           computers in Futures Churches locations and on servers in Australia.<br/><br/>
//           Information you provide in paper form may be transferred to secure virtual systems
//           or stored in secure physical filing systems.<br/><br/>
//           We will never share, sell, or rent your personal information with third parties for their
//           promotional use.<br/><br/>
//           3. Access to your information<br/><br/>
//           You can make a request to access your personal information that the Church holds
//           about you by contacting the Church’s Privacy Officer as set out below. We will
//           provide you with access to your personal information unless we are legally
//           authorised to refuse your request. We may charge a reasonable amount for
//           providing access.<br/><br/>

//           If you wish to change personal information that is out of date or inaccurate at any
//           time please contact us. After notice from you, we will take reasonable steps to
//           correct any of your information which is inaccurate, incomplete or out of date. If you
//           wish to have your personal information deleted, please let us know and we will
//           delete that information wherever practicable.<br/><br/>

//           We may refuse your request to access, amend or delete your personal information in
//           certain circumstances. If we do refuse your request, we will provide you with a
//           reason for our decision and, in the case of amendment, we will note with your
//           personal information that you have disputed its accuracy.<br/><br/>
//           4. Security<br/><br/>
//           The Church will take reasonable steps to keep secure any personal information
//           which we hold and to keep this information accurate and up to date. Personal
//           information is stored in a secure server or secure files.<br/><br/>
//           The Internet is not a secure method of transmitting information. Accordingly, the
//           Church cannot accept responsibility for the security of information you send to or
//           receive from us over the Internet or for any unauthorised access or use of that
//           information.
//           5. Changes to this Privacy Policy<br/><br/>
//           The Church may amend this Privacy Policy from time to time by having the amended
//           version available at the information counters at the Church or on our website at
//           https://futures.church/australia/
//             We suggest that you visit our website regularly
//           to keep up to date with any changes.<br/><br/>
//           6. Contacting us<br/><br/>
//           If you would like any further information, or have any queries, problems or
//           complaints relating to the Church’s Privacy Policy or our information handling
//           practices in general, please contact our Privacy Officer by calling +61 8 8336 0000
//           or writing to The Privacy Officer, Influencers Church, 57 Darley Road, Paradise
//           SA 5075, AUSTRALIA.

//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleConfirmTerms}
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//            I Agree
//           </Button>
//         </Box>
//       </Fade>
//     </Modal>
//   );


//   const renderSignIn = () => (
//     <Grid container spacing={2}>
//       <Grid item xs={12} sx={{ marginTop: '20px' }}>
//         <TextField
//           fullWidth
//           label="Email Address"
//           value={formData.email}
//           onChange={(e) => handleInputChange('email', e.target.value)} 
//           error={!!errors.email}
//           helperText={errors.email} 
//         />
//       </Grid>
//       <Grid item xs={12}>
//     <TextField
//         fullWidth
//         type={showPassword ? 'text' : 'password'} // Toggle between text and password
//         label="Password"
//         value={formData.password}
//         onChange={(e) => handleInputChange('password', e.target.value)}
//         error={!!errors.password}
//         helperText={errors.password}
//         InputProps={{
//             endAdornment: (
//                 <InputAdornment position="end">
//                     <IconButton
//                         onClick={togglePasswordVisibility}
//                         onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
//                     >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                 </InputAdornment>
//             ),
//         }}
//     />
// </Grid>
//     </Grid>
//   );

//   const renderSignUpPageOne = () => (
//     <Grid container spacing={2} >
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="First Name"
//           value={formData.firstName}
//           onChange={(e) => handleInputChange('firstName', e.target.value)}
//           error={!!errors.firstName}
//           helperText={errors.firstName}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Last Name"
//           value={formData.lastName}
//           onChange={(e) => handleInputChange('lastName', e.target.value)}
//           error={!!errors.lastName}
//           helperText={errors.lastName}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Mobile Number"
//           value={formData.phone}
//           onChange={(e) => handleInputChange('phone', e.target.value)}
//           error={!!errors.phone}
//           helperText={errors.phone}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Email Address"
//           value={formData.email}
//           onChange={(e) => handleInputChange('email', e.target.value)}
//           error={!!errors.email}
//           helperText={errors.email}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Suburb"
//           value={formData.suburb}
//           onChange={(e) => handleInputChange('suburb', e.target.value)}
//           error={!!errors.suburb}
//           helperText={errors.suburb}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.churchId}>
//           <InputLabel id="formChurchId-label">Church</InputLabel>
//           <Select
//             labelId="formChurchId-label"
//             value={formData.churchId}
//             onChange={(e) => handleInputChange('churchId', e.target.value)}
//             label="Church"
//           >
//             <MenuItem value="">
//               <em>Select Church</em>
//             </MenuItem>
//             {formData.churchNames.map((church) => (
//               <MenuItem key={church._id} value={church._id}>
//                 {church.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {errors.churchId && <Typography color="error">{errors.churchId}</Typography>}
//         </FormControl>
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           type="password"
//           label="Password"
//           value={formData.password}
//           onChange={(e) => handleInputChange('password', e.target.value)}
//           error={!!errors.password}
//           helperText={errors.password}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           type="password"
//           label="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//           error={!!errors.confirmPassword}
//           helperText={errors.confirmPassword}
//         />
//       </Grid>
//       <Grid item xs={12} container justifyContent="flex-end">
//         <Button variant="contained" color="primary" style={{background: 'rgb(11 166 122)'}} onClick={handleNextPage}>
//           Next
//         </Button>
//       </Grid>
//     </Grid>
//   );
//   // style={{backgroundColor: "rgb(229 229 229)"}}

//   const renderSignUpPageTwo = () => (
//     <Grid container spacing={2} >
//       <Grid item xs={12}>
//         <Grid container spacing={1}>
//           <Grid item xs={12}>
//             <Grid container direction="row" alignItems="center" spacing={1}>
//               <Grid item>
//                 <IconButton size="small" color="primary">
                
//                 </IconButton>
//               </Grid>
//               <Grid item>
//                 <Typography sx={{ mt: 2}} style={{textAlign: 'center', marginLeft: '85px'}} variant="h6" color="black">
//                   Get to Know You
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Grid>
  
//           <Grid item xs={12}>
//             <Grid container spacing={1}>
//               <Grid item xs={12}>
//                 <Typography variant="body1" sx={{ mt: 2}}>
//                   Have you been to this church before?
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Grid container spacing={1}>
//                   {['Yes', 'No'].map(option => (
//                     <Grid item key={option} xs={6}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         color={formData.attendedBefore === option ? 'success' : 'default'}
//                         onClick={() => handleInputChange('attendedBefore', option)}
//                       >
//                         {option}
//                       </Button>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Grid container spacing={1}>
//               <Grid item xs={12}>
//                 <Typography variant="body1" sx={{ mt: 2}}>
//                   Describe your level of faith:
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Grid container spacing={1} >
//                   {[
//                     'No faith',
//                     'Uncertain',
//                     'Open to faith',
//                     'Actively Exploring',
//                     'Strong faith',
//                   ].map(level => (
//                     <Grid item key={level} xs={12} sx={{ mt: 2}}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         color={formData.faithLevel === level ? 'success' : 'default'}
//                         onClick={() => handleInputChange('faithLevel', level)}
//                       >
//                         {level}
//                       </Button>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Grid container spacing={1}>
//               <Grid item xs={12}>
//                 <Typography variant="body1" sx={{ mt: 2}}>
//                   Did someone bring you to church?
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Grid container spacing={1}>
//                   {['Yes', 'No'].map(option => (
//                     <Grid item key={option} xs={6}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         color={formData.broughtBy === option ? 'success' : 'default'}
//                         onClick={() => handleInputChange('broughtBy', option)}
//                       >
//                         {option}
//                       </Button>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>
//               {formData.broughtBy === 'Yes' && (
//                 <Grid item xs={12}>
//                   <Grid container spacing={1}>
//                     <Grid item xs={12}>
//                       <Typography variant="body1">
//                         Who brought you?
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Grid container spacing={1}>
//                         <Grid item xs={12}>
//                           <Grid container spacing={1}>
//                             <Grid item xs={1}>
//                               <IconButton size="small" color="primary">
//                                 {/* <AccountIcon /> */}
//                               </IconButton>
//                             </Grid>
//                             <Grid item xs={11}>
//                               <TextField
//                                 fullWidth
//                                 variant="standard"
//                                 value={formData.broughtByName}
//                                 onChange={event => handleInputChange('broughtByName', event.target.value)}
//                                 error={errors.firstName}
//                                 helperText={errors.firstName && 'Error message'}
//                               />
//                             </Grid>
//                           </Grid>
//                         </Grid>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               )}
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//       {/* ... (rest of the code for page two remains the same) ... */}
//       <Grid item xs={12}>
//   <Grid container spacing={1} sx={{ mt: 3 }} direction="row" justifyContent="space-between">
//     <Grid item>
//       <Button
//         sx={{
//           ms: 10,
//           color: 'rgb(11 166 122)', // Custom light blue color
//           borderColor: 'rgb(11 166 122)',
//           '&:hover': {
//             backgroundColor: '#4dabf5',
//             color: '#fff',
//           }
//         }}
//         variant="outlined"
//         onClick={() => setCurrentPage(1)}
//       >
//         Prev
//       </Button>
//     </Grid>
//     <Grid item>
//       <Button
//         sx={{
//           // color: '#4dabf5', // Custom light blue color
//           borderColor: '#4dabf5',
       
//           '&:hover': {
//             backgroundColor: '#4dabf5',
//             color: '#fff',
//           }
//         }}
//         variant="contained" style={{background: 'rgb(11 166 122)'}} 
//         onClick={() => setCurrentPage(3)}
//       >
//         Next
//       </Button>
//     </Grid>
//   </Grid>
// </Grid>




//     </Grid>
//   );

//   const renderSignUpPageThree = () => (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <Typography variant="h6" color="black">
//           Terms and Conditions
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <Typography variant="body1">
        
//         By creating an account, you agree to our Terms of Service and Privacy Policy. 
//         We're committed to protecting your personal information and ensuring a safe 
//         experience within our church community.
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <Link variant="outlined" color="primary" onClick={handleOpenTermsModal}>
//           Read Our Privacy Policy
//         </Link>
//       </Grid>
//       <Grid item xs={12}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={formData.termAgreement}
//               onChange={(e) => handleInputChange('termAgreement', e.target.checked)}
//             />
//           }
//           label="I accept Futures Church will use this information in line with their Privacy Policy"
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Grid container spacing={2} direction="row" justifyContent="space-between">
//           <Grid item>
//             <Button 
//                 sx={{
//                   // color: '#4dabf5', // Custom light blue color
//                   borderColor: '',
//                   '&:hover': {
//                     backgroundColor: '#4dabf5',
//                     color: '#fff',
//                   }
//                 }}
//               variant="outlined"
//               color="primary"
//               onClick={() => setCurrentPage(2)}
//             >
//               Prev
//             </Button>
//           </Grid>
//           <Grid item>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={handleSubmit}
//               disabled={!formData.termAgreement}
//             >
//               Finish
//             </Button>
//           </Grid>
//         </Grid>
//       </Grid>  
//     </Grid>
//   );

 
//   const renderPageContent = () => {
//     switch (currentPage) {
//       case 1:
//         return renderSignUpPageOne();
//       case 2:
//         return renderSignUpPageTwo();
//       case 3:
//         return renderSignUpPageThree();
//       default:
//         return null;
//     }
//   };
//   return (
//     <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <Paper elevation={1} style={{ width: '80%', maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <Box p={3} style={{ overflowY: 'auto', marginLeft: '15px'}} sx={{
//           '::-webkit-scrollbar': {
//             width: '2px', // Slimmer width for the scrollbar
//           },
//           '::-webkit-scrollbar-thumb': {
//             backgroundColor: '#fff', // Color of the scrollbar thumb
//             borderRadius: '8px', // Rounded scrollbar thumb
//           },
//           '::-webkit-scrollbar-thumb:hover': {
//             backgroundColor: '#555', // Darker on hover
//           },
//           '::-webkit-scrollbar-track': {
//             backgroundColor: '#f1f1f1', // Scrollbar track color
//           },
//         }}>
//         <Typography variant="h6" align="center" gutterBottom style={{background: 'rgb(11 166 122)', color:'white',
//     padding: '12px', marginLeft: '-14px', marginBottom: '20px'}} >
//           {isSignIn ? 'Sign In' : 'Sign Up'}
//           {!isSignIn && (
//             <Link 
//               component="button"
//               variant="h6"
//               onClick={() => setIsSignIn(true)}
//               sx={{ float: 'right', paddingRight: '7px', color:'white',  textDecoration: 'none', // Remove underline by default
//                 '&:hover': {
//                   textDecoration: 'underline', // Show underline on hover
//                 }, }}
              
//             >
//               Sign In
//             </Link>
//           )}
//          </Typography>

        
//           {isSignIn ? renderSignIn() : renderPageContent()}
//         </Box>
//         <Box p={2} mt="auto">
          
//           <Grid container spacing={2} justifyContent="center">
//           {isSignIn && (
//               <>
//                 <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   style={{ background: 'rgb(11 166 122)' }}
//                   onClick={handleSubmit}
//                   sx={{ width: '88%', marginLeft: '20px', marginRight: '15px' }} 
//                 >
//                   Login
//                 </Button>

//                 </Grid>
//                 <Grid item xs={12}>
//                 <Typography align="center">
//                   Don't have an account?&nbsp;&nbsp;
//                   <span
//                     style={{
//                       textDecoration: "none",
//                       cursor: "pointer",
//                       color: "rgb(11 166 122)"
//                     }}
//                     onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
//                     onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
//                     onClick={() => setIsSignIn(!isSignIn)}
//                   >
//                    SIGN UP
//                   </span>
//                 </Typography>


                
//                 </Grid>
//               </>
//             )}

//           </Grid>
//         </Box>
//       </Paper>
//       {renderTermsModal()}
//     </Container>


//   );
// };

// export default SignupScreen;




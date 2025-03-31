import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Box,
  Paper,
} from '@mui/material';

import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl)
// Validation schema for signup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string().required('First name is required'),
  }),
  lastName: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string().required('Last name is required'),
  }),
  email: Yup.string().email('Invalid email').required('Email is required'),
  suburb: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string().required('Suburb is required'),
  }),
  phone: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string()
      .matches(/^\d+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .required('Mobile number is required'),
  }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  }),
  churchId: Yup.string().when('isSignIn', {
    is: false,
    then: Yup.string().required('Church selection is required'),
  }),
});

const SignupScreen = ({ history }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // To navigate after successful login
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});

  // Fetch church names on component mount
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

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true; // Form is valid
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) { // Check if inner exists
        validationErrors.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false; // Form is invalid
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    if (isSignIn) {
      // Handle login
      const loginData = {
        email: formData.email,
        password: formData.password,
      };
      try {
        const response = await axios.post(`${apiBaseUrl}/auth/login`, loginData);
        const { user } = response.data;

        console.log("login", user)
        localStorage.setItem('userId', user.id);
        localStorage.setItem('firstName', user.firstName);
        localStorage.setItem('lastName', user.lastName);

        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userType', user.type);
        navigate('/');
        window.location.reload()
      } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
      }
    } else {
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
        church: formData.churchId,
        password: formData.password,
        attendedBefore: formData.attendedBefore,
        faithLevel: formData.faithLevel,
        termAgreement: formData.termAgreement,
        broughtBy: formData.broughtBy === 'Yes' ? formData.broughtByName : formData.broughtBy,
        type: "4"
      };

      try {
        await axios.post(`${apiBaseUrl}/user/add`, registrationData);
        alert('Your account has been created successfully!');
        navigate('/');
      } catch (err) {
        alert(err.response.data.error || 'Registration failed');
      }
    }
  };

  const renderSignIn = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </Grid> */}
    </Grid>
  );

  const renderSignUpPageOne = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Mobile Number"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Suburb"
          value={formData.suburb}
          onChange={(e) => handleInputChange('suburb', e.target.value)}
          error={!!errors.suburb}
          helperText={errors.suburb}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="formChurchId-label">Church</InputLabel>
          <Select
            labelId="formChurchId-label"
            value={formData.churchId}
            onChange={(e) => handleInputChange('churchId', e.target.value)}
            label="Church"
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
        </FormControl>
        <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={() => setCurrentPage(2)}>
          Next
        </Button>
      </Grid>
    </Grid>
  );

  const renderSignUpPageTwo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <IconButton size="small" color="primary">
                
                </IconButton>
              </Grid>
              <Grid item>
                <Typography sx={{ mt: 2}} style={{textAlign: 'center', marginLeft: '85px'}} variant="h6" color="primary">
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
                        color={formData.attendedBefore === option ? 'primary' : 'default'}
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
                    <Grid item key={level} xs={6} sx={{ mt: 2}}>
                      <Button
                        fullWidth
                        variant="contained"
                        color={formData.faithLevel === level ? 'primary' : 'default'}
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
                        color={formData.broughtBy === option ? 'primary' : 'default'}
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
  
     <Grid item xs={5}>
  <Grid container spacing={1} sx={{ mt: 3}}  direction="column" alignItems="flex-end">
    <Grid item>
      <Button
        sx={{ ms: 10}} // margin-bottom for spacing between buttons
        variant="contained"
        color="primary"
        onClick={() => setCurrentPage(1)}
      >
        Back
      </Button>
      <Button
       
        variant="contained"
        color="primary"
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
    <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h6" color="primary">
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
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.termAgreement}
            onChange={(e) => handleInputChange('termAgreement', e.target.checked)}
          />
        }
        label="I agree to the Terms and Conditions"
      />
    </Grid>

    <Grid item xs={12}>
      <Typography variant="body1">
        By checking the box above, you acknowledge that you have read and agree to our Terms of Service and Privacy Policy.
      </Typography>
    </Grid>

    <Grid item xs={5}>
      <Grid container spacing={1} direction="column" alignItems="flex-end">
        <Grid item>
          <Button
            
            variant="contained"
            color="primary"
            onClick={() => setCurrentPage(2)}
          >
            Back
          </Button>
       
          <Button
            
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
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
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Paper elevation={3} style={{ padding: '20px', width: '75%' }}>
      <Typography variant="h5" align="center">
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </Typography>
      {isSignIn ? renderSignIn() : renderPageContent()}
  
      {/* Button section */}
      <Box marginTop={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              {isSignIn ? 'Login' : 'Sign Up'}
            </Button>
          </Grid>
        </Grid>
      </Box>
  
      {/* Toggle between SignUp/Login */}
      <Box marginTop={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center">
              Already {isSignIn ? 'have an account?' : 'signed up?'}
            </Typography>
            <Button variant="outlined" onClick={() => setIsSignIn(!isSignIn)} fullWidth>
              {isSignIn ? 'Sign Up' : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  </Container>
  
  );
};

export default SignupScreen;

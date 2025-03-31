import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Divider,
  Box,
  FormHelperText,
  useTheme
} from '@mui/material';
import {
  ExpandMore,
  Visibility,
  VisibilityOff,
  Person,
  Work,
  Security,
  School,
  AccountBalance,
  Info
} from '@mui/icons-material';

const StaffMemberModal = ({
  open,
  onClose,
  currentUser,
  setCurrentUser,
  modalType,
  validationErrors,
  handleFormSubmit,
  churches,
  userType,
  error
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basicInfo');

  // Handle input change
  const handleInputChange = (field, value) => {
    setCurrentUser((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  // Handle array input change (for comma-separated fields)
  const handleArrayInputChange = (field, value) => {
    setCurrentUser((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  // Toggle accordion section
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // Common TextField props for consistent styling
  const textFieldProps = {
    fullWidth: true,
    margin: "normal",
    variant: "outlined",
    size: "small",
    sx: {
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
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        // backgroundColor: '#231f20', 
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {/* <Person />  */}
        {modalType === 'Save' ? 'Add Staff Member' : 'Edit Staff Member'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, mt: 1 }}>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2, p: 1, bgcolor: '#fff4f4', borderRadius: 1 }}>
              {error}
            </Typography>
          )}

          {/* Basic Information */}
          <Accordion 
            expanded={expandedSection === 'basicInfo'} 
            onChange={handleAccordionChange('basicInfo')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">Basic Information</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="First Name"
                    required
                    value={currentUser.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!validationErrors.firstName}
                    helperText={validationErrors.firstName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" sx={{ color: '#231f20' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Last Name"
                    value={currentUser.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!validationErrors.lastName}
                    helperText={validationErrors.lastName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Email"
                    type="email"
                    required
                    value={currentUser.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={modalType === 'Update'} 
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Phone Number"
                    required
                    value={currentUser.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!validationErrors.phone}
                    helperText={validationErrors.phone}
                    placeholder="+1234567890"
                  />
                </Grid>

                {modalType === 'Save' && (
                  <Grid item xs={12}>
                    <TextField
                      {...textFieldProps}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={currentUser.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!validationErrors.password}
                      helperText={validationErrors.password || "Password must be at least 6 characters"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#231f20' }}
                            >
                              {showPassword ? <Visibility /> :  <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Date of Birth"
                    type="date"
                    value={currentUser.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl 
                    {...textFieldProps}
                    error={!!validationErrors.gender}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={currentUser.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      label="Gender"
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {validationErrors.gender && (
                      <FormHelperText error>{validationErrors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...textFieldProps}
                    label="Suburb"
                    required
                    value={currentUser.suburb || ''}
                    onChange={(e) => handleInputChange('suburb', e.target.value)}
                    error={!!validationErrors.suburb}
                    helperText={validationErrors.suburb}
                  />
                </Grid>
                
                {userType !== '2' && (
                  <Grid item xs={12}>
                    <FormControl
                      {...textFieldProps}
                      error={!!validationErrors.churchId}
                      required={userType === '1'}
                    >
                      <InputLabel>Church Name</InputLabel>
                      <Select
                        label="Church Name"
                        value={currentUser.churchId || ''}
                        onChange={(e) => handleInputChange('churchId', e.target.value)}
                      >
                        <MenuItem value=""><em>Select Church</em></MenuItem>
                        {churches.map((church) => (
                          <MenuItem key={church._id} value={church._id}>
                            {church.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.churchId && (
                        <FormHelperText error>{validationErrors.churchId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                )}
                
             {/* {modalType === 'Update' && (   
                <Grid item xs={12}>
                  <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Profile Photo
                    </Typography>
                    <input
                      type="file"
                      onChange={(e) => handleInputChange('profilePhoto', e.target.files[0])}
                      accept="image/*"
                      style={{ width: '100%' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: JPG, PNG (max 5MB)
                    </Typography>
                  </Box>
                </Grid>
                )} */}
              </Grid>
            
            </AccordionDetails>
          </Accordion>

          {/* Employment Details */}
          <Accordion 
            expanded={expandedSection === 'employment'} 
            onChange={handleAccordionChange('employment')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">Employment Details</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Job Title/Role"
                    value={currentUser.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Department"
                    value={currentUser.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl {...textFieldProps}>
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      value={currentUser.employmentType || ''}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      label="Employment Type"
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                      <MenuItem value="Part-Time">Part-Time</MenuItem>
                      <MenuItem value="Contractor">Contractor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl {...textFieldProps}>
                    <InputLabel>Work Location</InputLabel>
                    <Select
                      value={currentUser.workLocation || ''}
                      onChange={(e) => handleInputChange('workLocation', e.target.value)}
                      label="Work Location"
                    >
                      <MenuItem value="">Select Location</MenuItem>
                      <MenuItem value="Onsite">Onsite</MenuItem>
                      <MenuItem value="Remote">Remote</MenuItem>
                      <MenuItem value="Hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Start Date"
                    type="date"
                    value={currentUser.startDate ? currentUser.startDate.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="End Date"
                    type="date"
                    value={currentUser.endDate ? currentUser.endDate.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Work Email"
                    type="email"
                    value={currentUser.workEmail || ''}
                    onChange={(e) => handleInputChange('workEmail', e.target.value)}
                    placeholder="work@company.com"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Country of Origin"
                    value={currentUser.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Australia"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Access & Permissions */}
          <Accordion 
            expanded={expandedSection === 'access'} 
            onChange={handleAccordionChange('access')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">Access & Permissions</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl {...textFieldProps}>
                    <InputLabel>User Role</InputLabel>
                    <Select
                      value={currentUser.type || '3'} // Default to Staff (3)
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      label="User Role"
                      disabled // Since this is specifically for staff members
                    >
                      <MenuItem value="3">Staff</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="System Access Level"
                    value={currentUser.systemAccessLevel || ''}
                    onChange={(e) => handleInputChange('systemAccessLevel', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...textFieldProps}
                    label="Assigned Teams"
                    value={currentUser.assignedTeams || ''}
                    onChange={(e) => handleArrayInputChange('assignedTeams', e.target.value)}
                    placeholder="e.g., Development, Testing, Design"
                    helperText="Enter comma-separated values"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Skills & Qualifications */}
          <Accordion 
            expanded={expandedSection === 'skills'} 
            onChange={handleAccordionChange('skills')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">Skills & Qualifications</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Education Level"
                    value={currentUser.educationLevel || ''}
                    onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    placeholder="e.g., Bachelor's Degree"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Certifications"
                    value={currentUser.certifications || ''}
                    onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                    placeholder="e.g., AWS Certified, Scrum Master"
                    helperText="Enter comma-separated values"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Skills & Competencies"
                    value={currentUser.skills || ''}
                    onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                    placeholder="e.g., JavaScript, React, Node.js"
                    helperText="Enter comma-separated values"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Languages Spoken"
                    value={currentUser.languagesSpoken || ''}
                    onChange={(e) => handleArrayInputChange('languagesSpoken', e.target.value)}
                    placeholder="e.g., English, Spanish"
                    helperText="Enter comma-separated values"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* HR & Payroll Details */}
          <Accordion 
            expanded={expandedSection === 'hr'} 
            onChange={handleAccordionChange('hr')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalance fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">HR & Payroll Details</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Employee ID"
                    value={currentUser.employeeId || ''}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Salary/Hourly Rate"
                    type="number"
                    value={currentUser.salaryOrHourlyRate || ''}
                    onChange={(e) => handleInputChange('salaryOrHourlyRate', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Payroll Bank Details"
                    type={showPassword ? 'text' : 'password'}
                    value={currentUser.payrollBankDetails || ''}
                    onChange={(e) => handleInputChange('payrollBankDetails', e.target.value)}
                    placeholder="Bank Account Details"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#231f20' }}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="TFN/ABN"
                    value={currentUser.tfnAbn || ''}
                    onChange={(e) => handleInputChange('tfnAbn', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...textFieldProps}
                    label="Work Visa Status"
                    value={currentUser.workVisaStatus || ''}
                    onChange={(e) => handleInputChange('workVisaStatus', e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Additional Information */}
          <Accordion 
            expanded={expandedSection === 'additional'} 
            onChange={handleAccordionChange('additional')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info fontSize="small" />
                <Typography variant="subtitle1" fontWeight="medium">Additional Information</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="Emergency Contact"
                    value={currentUser.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Phone Number"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...textFieldProps}
                    label="LinkedIn Profile"
                    type="url"
                    value={currentUser.linkedinProfile || ''}
                    onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    {...textFieldProps}
                    label="Notes & Comments"
                    multiline
                    rows={3}
                    value={currentUser.notesAndComments || ''}
                    onChange={(e) => handleInputChange('notesAndComments', e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-end', marginRight: '5px' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="secondary"
          // sx={{ borderColor: '#231f20', color: '#231f20' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleFormSubmit} 
          variant="contained" 
          className="bg-b"
          sx={{ backgroundColor: '#231f20', '&:hover': { backgroundColor: '#3d3a3b' } }}
        >
          {modalType}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffMemberModal;
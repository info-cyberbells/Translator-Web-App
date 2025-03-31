import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const initialUserState = {
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    image: '',
    suburb: '',

    // Employment Details
    jobTitle: '',
    department: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    workLocation: '',
    workEmail: '',

    // Access & Permissions
    type: '',
    systemAccessLevel: '',
    assignedTeams: [],

    // Skills & Qualifications
    educationLevel: '',
    certifications: [],
    skills: [],
    languagesSpoken: [],

    // HR & Payroll Details
    employeeId: '',
    salaryOrHourlyRate: '',
    payrollBankDetails: '',
    tfnAbn: '',
    workVisaStatus: '',

    // Additional Information
    emergencyContact: '',
    linkedinProfile: '',
    notesAndComments: ''
  };

  const [user, setUser] = useState(initialUserState);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  useEffect(() => {
    fetchUserProfile();
  }, []);

// Clean array data when setting user state
const cleanArrayData = (data) => {
  const cleanedData = { ...data };
  
  // List of fields that should be arrays
  const arrayFields = ['assignedTeams', 'certifications', 'skills', 'languagesSpoken'];
  
  arrayFields.forEach(field => {
    if (cleanedData[field]) {
      let cleanArray;
      if (Array.isArray(cleanedData[field])) {
        cleanArray = cleanedData[field].map(item => {
          try {
            const parsed = JSON.parse(item);
            return Array.isArray(parsed) ? parsed[0] : item;
          } catch (e) {
            return item;
          }
        });
      } else if (typeof cleanedData[field] === 'string') {
        try {
          cleanArray = JSON.parse(cleanedData[field]);
        } catch (e) {
          cleanArray = [cleanedData[field]];
        }
      }
      cleanedData[field] = cleanArray.filter(Boolean);
    }
  });
  
  return cleanedData;
};
  
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError("User ID not found in local storage");
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/user/detail/${userId}`);
      const cleanedData = cleanArrayData(response.data);
      setUser(cleanedData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching user profile");
    }
  };

  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
    setError(null);
  };

  const handleArrayInputChange = (field, value) => {
    const arrayValues = value.split(',').map(item => item.trim());
    handleInputChange(field, arrayValues);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Required fields validation
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      jobTitle: 'Job Title',
      department: 'Department',
      employmentType: 'Employment Type',
      workLocation: 'Work Location',
      startDate: 'Start Date',
      type: 'User Role',
      emergencyContact: 'Emergency Contact'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!user[field]) {
        setError(`${label} is required`);
        return false;
      }
    }

    // Phone number format validation
    if (!/^\+?[\d\s-]+$/.test(user.phone)) {
      setError("Invalid phone number format");
      return false;
    }

    // Email format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format");
      return false;
    }
    if (user.workEmail && !emailRegex.test(user.workEmail)) {
      setError("Invalid work email format");
      return false;
    }

    // LinkedIn URL validation
    if (user.linkedinProfile && !/^https?:\/\/.*linkedin\.com/.test(user.linkedinProfile)) {
      setError("Invalid LinkedIn profile URL");
      return false;
    }

    // Date validations
    const startDate = new Date(user.startDate);
    const endDate = new Date(user.endDate);
    if (user.endDate && startDate > endDate) {
      setError("End date cannot be earlier than start date");
      return false;
    }

    // Emergency contact format validation
    if (!/^.+\s*-\s*\+?[\d\s-]+$/.test(user.emergencyContact)) {
      setError("Emergency contact should be in format: Name - Phone Number");
      return false;
    }

    // Salary validation
    if (user.salaryOrHourlyRate && isNaN(user.salaryOrHourlyRate)) {
      setError("Salary must be a valid number");
      return false;
    }

    // Array field validations
    if (user.assignedTeams.length === 0) {
      setError("At least one team must be assigned");
      return false;
    }
    if (user.skills.length === 0) {
      setError("At least one skill must be specified");
      return false;
    }
    if (user.languagesSpoken.length === 0) {
      setError("At least one language must be specified");
      return false;
    }

    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError("User ID not found in local storage");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(user).forEach(key => {
        if (Array.isArray(user[key])) {
          formData.append(key, JSON.stringify(user[key]));
        } else {
          formData.append(key, user[key] || '');
        }
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.patch(
        `${apiBaseUrl}/user/profile-update/${userId}`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const cleanedData = cleanArrayData(response.data.user);
      setUser(cleanedData);
      // setUser(response.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Error updating profile");
    }
  };
  // const handleRemoveImage = () => {
  //   setImageFile(null);
  //   setImagePreview(null);
  //   handleInputChange('image', '');
  // };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("User ID not found in local storage");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await axios.patch(`${apiBaseUrl}/user/change-password/${userId}`, { 
        currentPassword, 
        newPassword 
      });
      toast.success("Password changed successfully");
      resetPasswordStates();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Error changing password");
    }
  };

  const resetPasswordStates = () => {
    setShowModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const renderFormSection = (title, children) => (
    <>
      <div className="section-heading mt-4">
        <h5 className="mb-0">{title}</h5>
      </div>
      {children}
    </>
  );

  const renderPasswordField = (label, value, showPassword, setShowPassword, setValue) => (
    <Form.Group className="mt-3">
      <Form.Label>{label}</Form.Label>
      <div className="position-relative">
        <Form.Control
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="focus-border"
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle-btn"
          type="button"
        >
          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </Button>
      </div>
    </Form.Group>
  );

  return (
    <React.Fragment>
      <style>
        {`
          .focus-border:focus {
            border-color: #231f20 !important;
            box-shadow: 0 0 0 0.2rem rgba(35, 31, 32, 0.25);
          }
          .section-heading {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #231f20;
          }
          .bg-b {
            background-color: #231f20 !important;
            border-color: #231f20 !important;
          }
          .bg-b:hover {
            background-color: #000000 !important;
            border-color: #000000 !important;
          }
          .password-toggle-btn {
            background: none;
            border: none;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            padding: 0;
          }
          .form-label.required:after {
            content: "*";
            color: red;
            margin-left: 4px;
          }
        `}
      </style>

      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Profile Settings</h4>
                <Button variant="primary" className="bg-b" onClick={() => setShowModal(true)}>
                  Change Password
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleProfileUpdate}>
                {/* Basic Information */}
                {renderFormSection("Basic Information", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="required">First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="required">Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={user.email}
                            disabled
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={user.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="focus-border"
                            placeholder="+1234567890"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            value={user.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="focus-border"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Photo</Form.Label>
                          <div className="d-flex gap-3 align-items-start">
                            <div className="flex-grow-1">
                              <Form.Control
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="focus-border"
                              />
                              <small className="text-muted d-block mt-1">
                                Supported formats: JPG, PNG, GIF (max 5MB)
                              </small>
                            </div>
                            {(imagePreview || user.image) && (
                              <div className="position-relative" style={{ minWidth: '100px' }}>
                                <img
                                  src={imagePreview || user.image}
                                  alt="Profile Preview"
                                  className="rounded"
                                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                {/* <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 rounded-circle p-1"
                                  onClick={handleRemoveImage}
                                  style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    margin: '-8px'
                                  }}
                                >
                                  ×
                                </Button> */}
                              </div>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* Employment Details */}
                {renderFormSection("Employment Details", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Job Title/Role</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Employment Type</Form.Label>
                          <Form.Select
                            value={user.employmentType}
                            onChange={(e) => handleInputChange('employmentType', e.target.value)}
                            className="focus-border"
                          >
                            <option value="">Select Type</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contractor">Contractor</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Work Location</Form.Label>
                          <Form.Select
                            value={user.workLocation}
                            onChange={(e) => handleInputChange('workLocation', e.target.value)}
                            className="focus-border"
                          >
                            <option value="">Select Location</option>
                            <option value="Onsite">Onsite</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={user.startDate ? user.startDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={user.endDate ? user.endDate.split('T')[0] : ''}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Work Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={user.workEmail}
                            onChange={(e) => handleInputChange('workEmail', e.target.value)}
                            className="focus-border"
                            placeholder="work@company.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* Access & Permissions */}
                {renderFormSection("Access & Permissions", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>User Role</Form.Label>
                          <Form.Select
                            value={user.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="focus-border"
                          >
                            <option value="">Select Role</option>
                            <option value="2">Admin</option>
                            <option value="3">Staff</option>
                            <option value="4">User</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>System Access Level</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.systemAccessLevel}
                            onChange={(e) => handleInputChange('systemAccessLevel', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Assigned Teams (comma-separated)</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.assignedTeams}
                            onChange={(e) => handleArrayInputChange('assignedTeams', e.target.value)}
                            className="focus-border"
                            placeholder="e.g., Development, Testing, Design"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* Skills & Qualifications */}
                {renderFormSection("Skills & Qualifications", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Education Level</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.educationLevel}
                            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                            className="focus-border"
                            placeholder="e.g., Bachelor's Degree"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Certifications (comma-separated)</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.certifications}
                            onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                            className="focus-border"
                            placeholder="e.g., AWS Certified, Scrum Master"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Skills & Competencies</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.skills}
                            onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                            className="focus-border"
                            placeholder="e.g., JavaScript, React, Node.js"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Languages Spoken (comma-separated)</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.languagesSpoken}
                            onChange={(e) => handleArrayInputChange('languagesSpoken', e.target.value)}
                            className="focus-border"
                            placeholder="e.g., English, Spanish"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* HR & Payroll Details */}
                {renderFormSection("HR & Payroll Details", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Employee ID</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.employeeId}
                            // disabled
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Salary/Hourly Rate</Form.Label>
                          <Form.Control
                            type="number"
                            value={user.salaryOrHourlyRate}
                            onChange={(e) => handleInputChange('salaryOrHourlyRate', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payroll Bank Details</Form.Label>
                          <Form.Control
                            type="password"
                            value={user.payrollBankDetails}
                            onChange={(e) => handleInputChange('payrollBankDetails', e.target.value)}
                            className="focus-border"
                            placeholder="Bank Account Details"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>TFN/ABN</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.tfnAbn}
                            onChange={(e) => handleInputChange('tfnAbn', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Work Visa Status</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.workVisaStatus}
                            onChange={(e) => handleInputChange('workVisaStatus', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                {/* Additional Information */}
                {renderFormSection("Additional Information", (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            className="focus-border"
                            placeholder="Phone Number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>LinkedIn Profile</Form.Label>
                          <Form.Control
                            type="url"
                            value={user.linkedinProfile}
                            onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                            className="focus-border"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Notes & Comments</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={user.notesAndComments}
                            onChange={(e) => handleInputChange('notesAndComments', e.target.value)}
                            className="focus-border"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                ))}

                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit" className="bg-b">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal show={showModal} onHide={resetPasswordStates}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            {renderPasswordField(
              "Current Password",
              currentPassword,
              showCurrentPassword,
              setShowCurrentPassword,
              setCurrentPassword
            )}

            {renderPasswordField(
              "New Password",
              newPassword,
              showNewPassword,
              setShowNewPassword,
              setNewPassword
            )}

            {renderPasswordField(
              "Confirm New Password",
              confirmPassword,
              showConfirmPassword,
              setShowConfirmPassword,
              setConfirmPassword
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={resetPasswordStates}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="bg-b">
                Change Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Profile;
                            
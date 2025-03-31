import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', suburb: '', phone: '' });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Added new state variables for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("User ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/user/detail/${userId}`);
        console.log(response.data);
        const { email, firstName, lastName, suburb, phone } = response.data;
        setUser({ email, firstName, lastName, suburb, phone });
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching user profile");
      }
    };
    fetchUserProfile();
  }, []);

  const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;

  const handleInputChange = (field, value) => {
    const trimmedValue = value.trim();

    if (field !== 'email' && !alphanumericRegex.test(trimmedValue)) {
      setError(`${field} should not contain special characters.`);
      return;
    }

    setUser((prevUser) => ({
      ...prevUser,
      [field]: trimmedValue
    }));
    setError(null);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError("User ID not found in local storage");
      return;
    }

    try {
      const response = await axios.patch(`${apiBaseUrl}/user/profile-update/${userId}`, user);
      setUser(response.data.user);
      console.log(response.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Error updating profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("User ID not found in local storage");
      return;
    }

    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await axios.patch(`${apiBaseUrl}/user/change-password/${userId}`, { currentPassword, newPassword });
      toast.success("Password changed successfully");
      // Reset all password-related states
      setShowModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
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

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
      <style>{`
        .focus-border:focus {
          border-color: #231f20 !important;
          box-shadow: 0 0 0 0rem #231f20;
        }
        body {
          overflow: hidden;
        }
        .text {
          color: #231f20 !important;
        }
        .position-relative {
          position: relative;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle-btn:focus {
          outline: none;
          box-shadow: none;
        }
        .form-control {
          padding-right: 40px;
        }
        .bg-transparent {
          background-color: transparent !important;
        }
        .bg-transparent:hover,
        .bg-transparent:focus {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-end mt-0">
                <Button 
                  variant="primary" 
                  style={{backgroundColor: '#231f20'}} 
                  onClick={() => setShowModal(true)}
                >
                  Change Password
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleProfileUpdate}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formFirstName">
                      <Form.Label className="mt-2 black">First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter first name" 
                        value={user.firstName || ''} 
                        className="focus-border black"
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formLastName">
                      <Form.Label className="mt-2 black">Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter last name" 
                        value={user.lastName || ''} 
                        className="focus-border black"
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formEmail">
                      <Form.Label className="mt-2 black">Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={user.email || ''} 
                        className="focus-border black"
                        readOnly
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formAddress">
                      <Form.Label className="mt-2 black">Suburb</Form.Label>
                      <Form.Control 
                        placeholder="Enter suburb" 
                        value={user.suburb || ''} 
                        className="focus-border black"
                        onChange={(e) => handleInputChange('suburb', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formPhone">
                      <Form.Label className="mt-2 black">Phone</Form.Label>
                      <Form.Control 
                        type="phone" 
                        placeholder="Enter phone" 
                        value={user.phone || ''} 
                        className="focus-border black"
                        readOnly
                      />
                    </Form.Group>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" type="submit" className='mt-3 bg-b'>
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
          <Modal.Title className="text">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="formCurrentPassword" className="position-relative">
              <Form.Label className='black'>Current Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="focus-border"
                />
                <Button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0"
                  style={{ right: '10px' }}
                  type="button"
                >
                  <i className={`fa ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formNewPassword" className="position-relative mt-3">
              <Form.Label className='black'>New Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="focus-border"
                />
                <Button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0"
                  style={{ right: '10px' }}
                  type="button"
                >
                  <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="position-relative mt-3">
              <Form.Label className='black'>Confirm New Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="focus-border"
                />
                <Button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0"
                  style={{ right: '10px' }}
                  type="button"
                >
                  <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" className='bg-b' onClick={resetPasswordStates}>
                Close
              </Button>
              <Button variant="primary" className='bg-b' type="submit">
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
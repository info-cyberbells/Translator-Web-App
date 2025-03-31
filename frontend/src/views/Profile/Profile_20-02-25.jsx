import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', suburb: '', phone: '' });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        const { email, firstName, lastName, suburb, phone } = response.data;
        setUser({ email, firstName, lastName, suburb, phone });
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching user profile");
      }
    };
    fetchUserProfile();
  }, []);

  // Rest of your existing functions remain the same
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
        .text {
          color: #231f20 !important;
        }
        .disabled-field {
          background-color: #e9ecef !important;
          opacity: 1 !important;
          cursor: not-allowed !important;
          color: #495057 !important;
        }
        .disabled-field:focus {
          outline: none !important;
          box-shadow: none !important;
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
        .bg-b {
          background-color: #231f20 !important;
          border-color: #231f20 !important;
        }
        .bg-b:hover {
          background-color: #000000 !important;
          border-color: #000000 !important;
        }
      `}</style>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-end mt-0">
                <Button variant="primary" className="bg-b" onClick={() => setShowModal(true)}>
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
                      <Form.Label className="mt-2">First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter first name" 
                        value={user.firstName || ''} 
                        className="focus-border"
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formLastName">
                      <Form.Label className="mt-2">Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter last name" 
                        value={user.lastName || ''} 
                        className="focus-border"
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formEmail">
                      <Form.Label className="mt-2">Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={user.email || ''} 
                        className="disabled-field"
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group controlId="formAddress">
                      <Form.Label className="mt-2">Suburb</Form.Label>
                      <Form.Control 
                        placeholder="Enter suburb" 
                        value={user.suburb || ''} 
                        className="focus-border"
                        onChange={(e) => handleInputChange('suburb', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formPhone">
                      <Form.Label className="mt-2">Phone</Form.Label>
                      <Form.Control 
                        type="phone" 
                        value={user.phone || ''} 
                        className="disabled-field"
                        disabled
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
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
          <Modal.Title className="text">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
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
                  className="password-toggle-btn"
                  type="button"
                >
                  <i className={`fa ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formNewPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
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
                  className="password-toggle-btn"
                  type="button"
                >
                  <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirm New Password</Form.Label>
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
                  className="password-toggle-btn"
                  type="button"
                >
                  <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: '#231f20' }}></i>
                </Button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" className="bg-b" onClick={resetPasswordStates}>
                Close
              </Button>
              <Button variant="primary" className="bg-b" type="submit">
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
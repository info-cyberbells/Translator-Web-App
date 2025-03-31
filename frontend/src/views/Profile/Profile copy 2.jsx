import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', address: '' });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch user profile from the API   
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
        const { email, firstName, lastName, address } = response.data;
        setUser({ email, firstName, lastName, address });
      } catch (err) {
        console.error(err); // Log the error for debugging
        setError(err.message || "Error fetching user profile");
      }
    };
    fetchUserProfile();
  }, []);

  // Regular expression to prevent special characters and allow only alphanumeric characters
  const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;

  // Generic input change handler with validation
  const handleInputChange = (field, value) => {
    const trimmedValue = value.trim(); // Remove leading/trailing spaces

    if (field !== 'email' && !alphanumericRegex.test(trimmedValue)) {
      setError(`${field} should not contain special characters.`);
      return;
    }

    setUser((prevUser) => ({
      ...prevUser,
      [field]: trimmedValue
    }));
    setError(null); // Clear error if the input is valid
  };

  // Handle form submission for profile update
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
      window.alert("Profile updated successfully");
      
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError(err.response?.data?.error || err.message || "Error updating profile");
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError("User ID not found in local storage");
      return;
    }

    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      await axios.patch(`${apiBaseUrl}/user/change-password/${userId}`, { currentPassword, newPassword });
      window.alert("Password changed successfully");
      setShowModal(false);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError(err.response?.data?.message || err.message || "Error changing password");
    }
  };

  return (
    <React.Fragment>

      <style>{`
        .focus-border:focus {
          border-color: #231f20 !important;
          box-shadow: 0 0 0 0rem #231f20;
        }
          .text {
          color: #231f20 !important;
          
        }
      `}</style>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-end mt-0">
                <Button variant="primary" style={{backgroundColor: '#231f20'}} onClick={() => setShowModal(true)}>Change Password</Button>
              </div>
            </Card.Header>

            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleProfileUpdate}>
                {/* First row with First Name and Last Name */}
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
                {/* Email in its own row */}
                <Form.Group controlId="formEmail">
                  <Form.Label className="mt-2">Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={user.email || ''} 
                    className="focus-border"
                    readOnly
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                {/* Email in its own row */}
                <Form.Group controlId="formPhone">
                  <Form.Label className="mt-2">Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Phone" 
                    value={user.phone || ''} 
                    className="focus-border"
                    readOnly
                  />
                </Form.Group>
              </div>

              </div>

                {/* Address as textarea */}
                <Form.Group controlId="formAddress">
                  <Form.Label className="mt-2">Address</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    placeholder="Enter address" 
                    value={user.address || ''} 
                    className="focus-border"
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Form.Group>

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

      {/* Modal for Change Password */}
      <Modal show={showModal} onHide={() => {
          setShowModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title className="text">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)} 
                className="focus-border"

              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                className="focus-border"

                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
                className="focus-border"

                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-flex justify-content-end mt-0">
              <Button variant="secondary" className='mt-3' onClick={() => {
                  setShowModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
              }}>Close</Button>
              <Button variant="primary"  className='mt-3 bg-b' type="submit">Change Password</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Profile;

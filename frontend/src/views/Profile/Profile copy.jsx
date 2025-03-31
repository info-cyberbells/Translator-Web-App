import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import NavRight from 'layouts/AdminLayout/NavBar/NavRight';
import NavLogo from 'layouts/AdminLayout/Navigation/NavLogo';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', address: '', image: '' });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');

  const handleImageClick = () => {
    setZoomedImage(user.image); // Set the image to zoom
    setShowImageModal(true); // Show the modal
  };

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
        const { image, email, firstName, lastName, address } = response.data;
        setUser({ image, email, firstName, lastName, address });
      } catch (err) {
        console.error(err); // Log the error for debugging
        setError(err.message || "Error fetching user profile");
      }
    };
    fetchUserProfile();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        image: URL.createObjectURL(file), // Create a local URL for immediate preview
      }));
    }
  };

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
      const formData = new FormData();
      formData.append('image', e.target.image.files[0]);
      Object.keys(user).forEach(key => {
        if (key !== 'image') {
          formData.append(key, user[key]); // Exclude image from the user object
        }
      });

      const response = await axios.patch(`${apiBaseUrl}/user/profile-update/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
      {/* <NavRight userImage={`${user.image}`} /> */}
      {/* <NavLogo userImage={`${user.image}`} />  */}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-end mt-0">
                <Button variant="primary" onClick={() => setShowModal(true)}>Change Password</Button>
              </div>
            </Card.Header>

            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group controlId="formImage">
                  <Form.Label>Upload Picture</Form.Label>
                  <Form.Control 
                    type="file" 
                    name="image" 
                    className="mb-2 mt-2" 
                    onChange={handleImageChange} // Call handleImageChange when the file input changes
                  />
                 
                  {user.image && <img src={`${user.image}`} alt="Profile" style={{ width: '130px', height: '125px' }} onClick={handleImageClick} />}
                  <Form.Label style={{marginLeft: '30px'}}>Profile Picture</Form.Label>
                </Form.Group>
                <Form.Group controlId="formFirstName">
                  <Form.Label className="mt-2">First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter first name" 
                    value={user.firstName || ''} 
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formLastName">
                  <Form.Label className="mt-2">Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter last name" 
                    value={user.lastName || ''} 
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label className="mt-2">Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={user.email || ''} 
                    readOnly // Email is not changeable
                  />
                </Form.Group>
                <Form.Group controlId="formAddress">
                  <Form.Label className="mt-2">Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter address" 
                    value={user.address || ''} 
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className='mt-3'>Update Profile</Button>
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
          <Modal.Title>Change Password</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
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
              <Button variant="primary" className='mt-3' type="submit">Change Password</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Profile;

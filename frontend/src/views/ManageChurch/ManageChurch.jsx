import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavRight from 'layouts/AdminLayout/NavBar/NavRight';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ChurchEdit = () => {
  const [church, setChurch] = useState({
    name: '',
    address: '',
    contact_no: '',
    city: '',
    state: '',
    country: '',
    senior_pastor_name: '',
    senior_pastor_phone_number: '',
    api_key: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchChurchDetails = async () => {
      const churchId = localStorage.getItem('churchId');
      console.log(churchId)
      if (!churchId) {
        setError("Church ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/church/detail/${churchId}`);
        const { name, address, contact_no, city, state, country, senior_pastor_name, senior_pastor_phone_number, api_key, image } = response.data;
        setChurch({ name, address, contact_no, city, state, country, senior_pastor_name,senior_pastor_phone_number, api_key, image });
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching church details");
      }
    };
    fetchChurchDetails();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

// Add this compression function
// Fix the compressImage function
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const imgElement = document.createElement('img'); // Change this line
      imgElement.src = event.target.result;
      imgElement.onload = () => {
        const canvas = document.createElement('canvas');
        let width = imgElement.width;
        let height = imgElement.height;

        // Maximum dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0, width, height);

        // Convert to Blob with quality
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          0.7 // compression quality
        );
      };
      imgElement.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};
// Update the handleImageChange function
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPEG, PNG)');
    return;
  }

  try {
    setIsUploading(true);
    
    // Compress image before converting to base64
    const compressedImage = await compressImage(file);
    const base64Image = await convertToBase64(compressedImage);
    const churchId = localStorage.getItem('churchId');

    const response = await axios.patch(`${apiBaseUrl}/church/edit/${churchId}`, {
      image: base64Image
    });

    setChurch(prev => ({
      ...prev,
      image: response.data.image || base64Image
    }));

    toast.success('Church image updated successfully');
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Error uploading image');
  } finally {
    setIsUploading(false);
  }
};
  const handleChurchUpdate = async (e) => {
    e.preventDefault();
    const churchId = localStorage.getItem('churchId');
    if (!churchId) {
      toast.error("Church ID not found in local storage");
      return;
    }
  
    try {
      // Create a copy of church data without the image field
      const { image, ...churchDataWithoutImage } = church;
      const response = await axios.patch(`${apiBaseUrl}/church/edit/${churchId}`, churchDataWithoutImage);
      // Update the church state while preserving the existing image
      setChurch(prev => ({
        ...response.data,
        image: prev.image // Preserve the existing image
      }));
      
      toast.success("Church details updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Error updating church details");
    }
  };
  
  // Modify handleImageChange to use a separate endpoint for image updates
  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  
  //   // Validate file type
  //   const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  //   if (!validTypes.includes(file.type)) {
  //     toast.error('Please upload a valid image file (JPEG, PNG)');
  //     return;
  //   }
  
  //   // Validate file size (5MB limit)
  //   // if (file.size > 5 * 1024 * 1024) {
  //   //   toast.error('Image size should be less than 5MB');
  //   //   return;
  //   // }
  
  //   try {
  //     setIsUploading(true);
  //     const base64Image = await convertToBase64(file);
  //     const churchId = localStorage.getItem('churchId');
  
  //     // Use a separate endpoint for image update
  //     const response = await axios.patch(`${apiBaseUrl}/church/edit/${churchId}`, {
  //       image: base64Image
  //     });
  
  //     setChurch(prev => ({
  //       ...prev,
  //       image: response.data.image || base64Image
  //     }));
  
  //     toast.success('Church image updated successfully');
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || 'Error uploading image');
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  return (
    <React.Fragment>
      <style>{`
        .focus-border:focus {
          border-color: #231f20 !important;
          box-shadow: 0 0 0 0rem #231f20;
        }
        .church-image-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          padding: 20px 0;
        }
        // .church-image-container {
        //   position: relative;
        //   width: 80%;
        //   height: 200px;
        //   border-radius: 8px;
        //   overflow: hidden;
        //   box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        //   cursor: pointer;
        //   background-color: #f8f9fa;
        // }

        //   .church-image {
        //   width: 100%;
        //   height: 100%;
        //   object-fit: none;
        //   transition: all 0.3s ease;
        // }
          .church-image-container {
            position: relative;
            // width: auto;
            // height: auto; 
            max-height: 100%; 
            padding: 60px;
            max-width: 100%; 
            display: inline-block; 
            border-radius: 8px;
            overflow: hidden;
            // box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            // background-color: #f8f9fa;
          }
          .church-image {
          display: block; 
          max-width: 100%; 
          height: auto; 
          object-fit: contain; 
          transition: all 0.3s ease;
        }
      
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(35, 31, 32, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .church-image-container:hover .image-overlay {
          opacity: 1;
        }
        .overlay-text {
          color: white;
          font-size: 14px;
          margin-top: 8px;
          text-align: center;
        }
        .upload-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: #231f20;
        }
        @media (max-width: 768px) {
          .church-image-container {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>

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
{console.log("chjrudjbf", church.image)}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <div className="church-image-section"> 
                <div className="church-image-container" onClick={handleImageClick}>
                  <Image
                    src={church.image || '/default-church.png'}
                    alt="Church"
                    className="church-image"
                  />
                  <div className="image-overlay">
                    <Camera size={24} color="white" />
                    <span className="overlay-text">Change Church Photo</span>
                  </div>
                  {isUploading && <div className="upload-progress" />}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Your existing form */}
              <Form onSubmit={handleChurchUpdate}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group controlId="formName">
                      <Form.Label className="mt-2 black">Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={church.name}
                        className="focus-border black"
                        onChange={(e) => setChurch({ ...church, name: e.target.value })}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group controlId="formContactNo">
                      <Form.Label className="mt-2 black">Contact No</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact number"
                        value={church.contact_no}
                        className="focus-border black"
                        onChange={(e) => setChurch({ ...church, contact_no: e.target.value })}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formCity">
                  <Form.Label className="mt-2 black">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={church.city}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, city: e.target.value })}
                  />
                </Form.Group>
              </div>

             <div className="col-md-6">

                <Form.Group controlId="formState">
                  <Form.Label className="mt-2 black">State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter state"
                    value={church.state}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, state: e.target.value })}
                  />
                </Form.Group>
              </div>

            </div>  

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formCountry">
                  <Form.Label className="mt-2 black">Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={church.country}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, country: e.target.value })}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="formPastorName">
                  <Form.Label className="mt-2 black">Senior Pastor Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={church.senior_pastor_name}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, senior_pastor_name: e.target.value })}
                  />
                </Form.Group>
              </div>


              <div className="col-md-12">
                <Form.Group controlId="formCountry">
                  <Form.Label className="mt-2 black">Senior Pastor Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={church.senior_pastor_phone_number}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, senior_pastor_phone_number: e.target.value })}
                  />
                </Form.Group>
              </div>
           
              {/* <div className="col-md-6">
                <Form.Group controlId="formApiKey">
                  <Form.Label className="mt-2 black">API Key</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter API Key"
                    value={church.api_key}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, api_key: e.target.value })}
                  />
                </Form.Group>

              </div> */}
              </div>  
                <Form.Group controlId="formAddress">
                  <Form.Label className="mt-2 black">Address</Form.Label>
                  <Form.Control
                    as="textarea" 
                    placeholder="Enter address"
                    value={church.address}
                     className="focus-border black"
                    onChange={(e) => setChurch({ ...church, address: e.target.value })}
                  />
                </Form.Group>
            

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" type="submit" className='mt-3 bg-b'>Update</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ChurchEdit;
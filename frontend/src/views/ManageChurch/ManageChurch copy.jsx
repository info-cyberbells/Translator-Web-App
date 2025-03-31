import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
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
    api_key: ''
  });
  const [error, setError] = useState(null);

  // Fetch church details from the API   
  useEffect(() => {
    const fetchChurchDetails = async () => {
      const churchId = localStorage.getItem('churchId');
      console.log(churchId) // Assuming you store the church ID in local storage
      if (!churchId) {
        setError("Church ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/church/detail/${churchId}`);
        const { name, address, contact_no, city, state, country, api_key } = response.data;
        setChurch({ name, address, contact_no, city, state, country, api_key });
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching church details");
      }
    };
    fetchChurchDetails();
  }, []);

  // Handle form submission for church update
  const handleChurchUpdate = async (e) => {
    e.preventDefault();
    const churchId = localStorage.getItem('churchId');
    if (!churchId) {
      setError("Church ID not found in local storage");
      return;
    }

    try {
      const response = await axios.patch(`${apiBaseUrl}/church/edit/${churchId}`, church);
      setChurch(response.data);
      window.alert("Church details updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Error updating church details");
    }
  };

  return (
    <React.Fragment>
      <style>{`
        .focus-border:focus {
          border-color: #231f20 !important;
          box-shadow: 0 0 0 0rem #231f20;
        }
      `}</style>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleChurchUpdate}>

              <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formName">
                  <Form.Label className="mt-2">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={church.name}
                    className="focus-border"
                    onChange={(e) => setChurch({ ...church, name: e.target.value })}
                  />
                </Form.Group>
              </div>
                
              <div className="col-md-6">

                <Form.Group controlId="formContactNo">
                  <Form.Label className="mt-2">Contact No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    value={church.contact_no}
                     className="focus-border"
                    onChange={(e) => setChurch({ ...church, contact_no: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formCity">
                  <Form.Label className="mt-2">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={church.city}
                     className="focus-border"
                    onChange={(e) => setChurch({ ...church, city: e.target.value })}
                  />
                </Form.Group>
              </div>

             <div className="col-md-6">

                <Form.Group controlId="formState">
                  <Form.Label className="mt-2">State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter state"
                    value={church.state}
                     className="focus-border"
                    onChange={(e) => setChurch({ ...church, state: e.target.value })}
                  />
                </Form.Group>
              </div>

            </div>  

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formCountry">
                  <Form.Label className="mt-2">Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={church.country}
                     className="focus-border"
                    onChange={(e) => setChurch({ ...church, country: e.target.value })}
                  />
                </Form.Group>
              </div>
           
              <div className="col-md-6">
                <Form.Group controlId="formApiKey">
                  <Form.Label className="mt-2">API Key</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter API Key"
                    value={church.api_key}
                     className="focus-border"
                    onChange={(e) => setChurch({ ...church, api_key: e.target.value })}
                  />
                </Form.Group>

              </div>
              </div>  
                <Form.Group controlId="formAddress">
                  <Form.Label className="mt-2">Address</Form.Label>
                  <Form.Control
                    as="textarea" 
                    placeholder="Enter address"
                    value={church.address}
                     className="focus-border"
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

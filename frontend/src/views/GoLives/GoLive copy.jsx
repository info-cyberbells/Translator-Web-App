import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import NavRight from 'layouts/AdminLayout/NavBar/NavRight';
import '../../index.scss'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_LIVE;
console.log(apiBaseUrl)
const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Function to start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Error accessing microphone");
    }
  };

  // Function to stop recording audio
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Handle data available from the media recorder
  const handleDataAvailable = async (event) => {
    if (event.data.size > 0) {
      try {
        const formData = new FormData();
        formData.append('audio', event.data, 'session-audio.webm'); // Append the audio blob

        const response = await axios.post(`${apiBaseUrl}/start_recording`, formData, {
          
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("response",response)
        setSuccess("Live session started successfully!");
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || "Error starting live session");
      }
    }
  };

  return (
    <React.Fragment>
      {/* <NavRight /> */}
      <Row className="justify-content-center align-items-start vh-100" style={{marginTop: '40px'}}> 
        <Col xs={12} >
          <Card className="w-100">
            <Card.Body className="text-center">
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <div className="d-flex justify-content-between">
                <Button 
                  variant="primary" 
                  onClick={startRecording} 
                  disabled={isRecording} className="bg-b"
                >
                  Start Recording
                </Button>
                <Button 
                  variant="danger" 
                  onClick={stopRecording} 
                  disabled={!isRecording} className="bg-b"
                >
                  Stop Recording
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GoLive;

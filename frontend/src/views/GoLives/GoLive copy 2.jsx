// import React, { useState } from 'react';
// import { Row, Col, Card, Button } from 'react-bootstrap';
// import axios from 'axios';
// import NavRight from 'layouts/AdminLayout/NavBar/NavRight';
// import '../../index.scss'

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_LIVE;
// console.log(apiBaseUrl)
// const GoLive = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [mediaRecorder, setMediaRecorder] = useState(null);

//   // Function to start recording audio
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       recorder.ondataavailable = handleDataAvailable;
//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (err) {
//       console.error(err);
//       setError("Error accessing microphone");
//     }
//   };

//   // Function to stop recording audio
//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   // Handle data available from the media recorder
//   const handleDataAvailable = async (event) => {
//     if (event.data.size > 0) {
//       try {
//         const formData = new FormData();
//         formData.append('audio', event.data, 'session-audio.webm'); // Append the audio blob

//         const response = await axios.post(`${apiBaseUrl}/start_recording`, formData, {

//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         console.log("response",response)
//         setSuccess("Live session started successfully!");
//         setError(null);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.error || err.message || "Error starting live session");
//       }
//     }
//   };

//   return (
//     <React.Fragment>
//       {/* <NavRight /> */}
//       <Row className="justify-content-center align-items-start vh-100" style={{marginTop: '40px'}}>
//         <Col xs={12} >
//           <Card className="w-100">
//             <Card.Body className="text-center">
//               {error && <p className="text-danger">{error}</p>}
//               {success && <p className="text-success">{success}</p>}
//               <div className="d-flex justify-content-between">
//                 <Button
//                   variant="primary"
//                   onClick={startRecording}
//                   disabled={isRecording} className="bg-b"
//                 >
//                   Start Recording
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={stopRecording}
//                   disabled={!isRecording} className="bg-b"
//                 >
//                   Stop Recording
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </React.Fragment>
//   );
// };

// export default GoLive;

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../index.scss';
import { TranscriptionContext } from '../../contexts/TranscriptionContext';
import { UserContext } from '../../contexts/UserContext';
const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const recognitionRef = useRef(null);
  const translationTimeoutRef = useRef(null);
  const lastTranscriptRef = useRef('');
  const finalTranscriptRef = useRef('');
  const { user } = useContext(UserContext);
  console.log(user)
  const { setTranscription: setSharedTranscription } = useContext(TranscriptionContext);

  const languages = [{ code: 'en', name: 'English' }];

  // Optimized translation function with debouncing
  const translateWithDebounce = async (text) => {
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    return new Promise((resolve) => {
      translationTimeoutRef.current = setTimeout(async () => {
        if (!text.trim()) return resolve('');

        try {
          const response = await axios.post('/translate', {
            text: text,
            targetLanguage: selectedLanguage
          });

          if (response.data && response.data.translatedText) {
            resolve(response.data.translatedText);
          } else {
            throw new Error('Translation failed');
          }
        } catch (error) {
          console.error('Translation error:', error);
          setError('Translation failed: ' + error.message);
          resolve(text);
        }
      }, 100);
    });
  };
  const handleSendTranscription = () => {
    // Only send if there's actual transcription content
    if (transcription && transcription.trim()) {
      setSharedTranscription(transcription);
      console.log('Sending current transcription:', transcription);
      // Optional: Add success message
      setSuccess('Transcription sent successfully!');
      setTimeout(() => setSuccess(null), 2000); // Clear success message after 2 seconds
    } else {
      setError('No transcription available to send');
      setTimeout(() => setError(null), 2000); // Clear error message after 2 seconds
    }
  };
  useEffect(() => {
    // For testing purposes
    console.log('Setting transcription to rahul');
    setSharedTranscription(transcription);
  }, []);
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setSuccess('Listening...');
        lastTranscriptRef.current = '';
        finalTranscriptRef.current = '';
        setError(null);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          setTimeout(() => {
            if (isRecording) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Restart error:', err);
              }
            }
          }, 50);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'no-speech' && isRecording) {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (isRecording) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Restart error:', err);
              }
            }
          }, 50);
        } else {
          setError(`Recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Only add to final transcript if it's not a duplicate
            if (!finalTranscriptRef.current.includes(transcript.trim())) {
              finalTranscript = transcript;
              finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + transcript;
            }
          } else {
            interimTranscript = transcript;
          }
        }

        if (selectedLanguage === 'en') {
          if (finalTranscript) {
            // Update transcription with new final transcript
            setTranscription(finalTranscriptRef.current);
            setSharedTranscription(finalTranscriptRef.current); // Update context
          } else if (interimTranscript && interimTranscript !== lastTranscriptRef.current) {
            // Show interim results only if they're different from the last one
            lastTranscriptRef.current = interimTranscript;
            const combinedTranscript = finalTranscriptRef.current + ' ' + interimTranscript;
            setTranscription(combinedTranscript);
            setSharedTranscription(combinedTranscript); // Update context
          }
        } else {
          // Handle translation
          const textToTranslate = finalTranscript || interimTranscript;
          if (textToTranslate && textToTranslate !== lastTranscriptRef.current) {
            lastTranscriptRef.current = textToTranslate;
            const translatedText = await translateWithDebounce(finalTranscriptRef.current + ' ' + textToTranslate);
            if (translatedText) {
              setTranscription(translatedText);
              setSharedTranscription(translatedText); // Update context
            }
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [isRecording, selectedLanguage]);

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      setTranscription('');
      setError(null);
      lastTranscriptRef.current = '';
      finalTranscriptRef.current = '';
      setIsRecording(true);
      // setSharedTranscription('rahul');
      recognitionRef.current.start();
    } catch (err) {
      console.error('Start recording error:', err);
      setError('Error starting recording: ' + err.message);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }
    setSuccess(null);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = `${newLanguage}-${newLanguage.toUpperCase()}`;
    }
  };

  return (
    <Row className="justify-content-center align-items-start vh-100" style={{ marginTop: '40px' }}>
      <Col xs={12}>
        <Card className="w-100">
          <Card.Body>
            {error && (
              <div className="alert alert-danger">
                <strong>Error: </strong>
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <strong>Status: </strong>
                {success}
              </div>
            )}

            <div className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label>Target Language</Form.Label>
                <Form.Select value={selectedLanguage} onChange={handleLanguageChange} disabled={isRecording}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={startRecording} disabled={isRecording} className="bg-b">
                  Start Speaking
                </Button>
                <Button variant="danger" onClick={stopRecording} disabled={!isRecording} className="bg-b">
                  Stop
                </Button>
              </div>
            </div>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{selectedLanguage === 'en' ? 'Transcription' : 'Translation'}</Card.Title>
                <div
                  className="p-3 bg-light border rounded"
                  style={{
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {transcription || `${selectedLanguage === 'en' ? 'Transcription' : 'Translation'} will appear here...`}
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
          <Button 
            variant="secondary" 
            onClick={handleSendTranscription}
            disabled={!transcription} // Disable if no transcription
            className="mb-3"
          >
            Send Current Transcription
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default GoLive;

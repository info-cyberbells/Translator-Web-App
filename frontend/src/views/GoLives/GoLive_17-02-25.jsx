import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../index.scss';
import SEO from 'views/Seo/SeoMeta';

const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('Ready to start');
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef('');
  const finalTranscriptRef = useRef('');
  const translationSourceRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).substring(7));
  const lastSpeechTimeRef = useRef(Date.now());
  const silenceTimerRef = useRef(null);

  const languages = [{ code: 'en', name: 'English' }];

  // Function to check for silence
  // const checkSilence = () => {
  //   const currentTime = Date.now();
  //   const timeSinceLastSpeech = currentTime - lastSpeechTimeRef.current;

  //   if (timeSinceLastSpeech > 10000) { // 2 seconds of silence
  //     setTranscription('');
  //   }
  // };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setSuccess('Broadcasting...');
        lastTranscriptRef.current = '';
        finalTranscriptRef.current = '';
        setError(null);
        lastSpeechTimeRef.current = Date.now();
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Restart error:', err);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Recognition error:', event);
        if (event.error === 'no-speech') {
          if (isRecording) {
            recognitionRef.current.stop();
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Restart error:', err);
              }
            }, 50);
          }
        }
        console.error('Recognition error:', event.error);
        setError(`Recognition error: ${event.error}`);
      };

      recognitionRef.current.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        lastSpeechTimeRef.current = Date.now();

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript = transcript;

            try {
              // Send final transcripts for translation
              await axios.post('http://52.189.226.39:4585/translate_realtime', {
                text: transcript,
                clientId: clientIdRef.current,
                isFinal: true
              });
            } catch (err) {
              console.error('Translation error:', err);
            }
          } else {
            interimTranscript = transcript;
          }
        }

        if (finalTranscript) {
          setTranscription(finalTranscriptRef.current + ' ' + finalTranscript);
          finalTranscriptRef.current = finalTranscriptRef.current + ' ' + finalTranscript;
        } else if (interimTranscript) {
          setTranscription(finalTranscriptRef.current + ' ' + interimTranscript);
        }
      };

      // Setup translation stream
      //translationSourceRef.current = new EventSource(`http://52.189.226.39:4585/stream_translation/pt?client_id=${clientIdRef.current}&role=broadcaster`);

      // Replace with
      const streamUrl = `http://52.189.226.39:4585/stream_translation/pt?client_id=${clientIdRef.current}&role=broadcaster`;
      console.log('Connecting to stream:', streamUrl);
      translationSourceRef.current = new EventSource(streamUrl);

      translationSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.translation) {
          setTranscription(data.translation);
        }
      };

      translationSourceRef.current.onerror = (error) => {
        console.error('Translation stream error:', error);
        setError('Translation stream error occurred');
      };

      // Setup silence detection
      // silenceTimerRef.current = setInterval(checkSilence, 1000);
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (translationSourceRef.current) {
        translationSourceRef.current.close();
      }
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const response = await axios.post('http://52.189.226.39:4585/start_stream');

      if (response.status !== 200) {
        throw new Error('Failed to start broadcast');
      }

      setTranscription('');
      setError(null);
      lastTranscriptRef.current = '';
      finalTranscriptRef.current = '';
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (err) {
      console.error('Start broadcasting error:', err);
      setError('Error starting broadcast: ' + err.message);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      await axios.post('http://52.189.226.39:4585/stop_stream');
    } catch (err) {
      console.error('Stop broadcasting error:', err);
    }

    setSuccess('Broadcast Stopped');
    setTranscription('');
  };

  return (
    <>
      <SEO
        title="Live Church Sermon Translator | Real-Time Sermon Translation"
        description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
        keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
        // canonical="https://churchtranslator.com/live-sermon-translator"
        canonical="real-time-sermon-translation"
      />
      <Row className="justify-content-center align-items-start vh-100" style={{ marginTop: '40px' }}>
        <Col xs={12}>
          <Card className="w-100">
            <Card.Body>
              <h4 className="text-center fw-bold text-dark">Real Time Sermon Translation</h4>
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
                  <Form.Label>Broadcasting Language</Form.Label>
                  <Form.Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} disabled={isRecording}>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                  {!isRecording ? (
                    <Button variant="primary" onClick={startRecording} className="bg-b">
                      Start Broadcasting
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={stopRecording} className="bg-b">
                      Stop Broadcasting
                    </Button>
                  )}
                </div>
              </div>

              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Current Broadcast</Card.Title>
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
                    {transcription || 'Your broadcast will appear here...'}
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GoLive;

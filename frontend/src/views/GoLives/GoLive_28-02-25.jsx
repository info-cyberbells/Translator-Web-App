import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  Container,
  Paper,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SEO from 'views/Seo/SeoMeta';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("APIBASEURL", apiBaseUrl)
// Styled components remain the same...
const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    color: '#47362b',
    fontSize: '16px',
    padding: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  backgroundColor: '#fff',
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '& .MuiSelect-icon': {
    color: '#47362b',
  }
}));

const StyledButton = styled(Button)(({ theme, $recording }) => ({
  backgroundColor: $recording ? '#8B0000' : '#47362b',
  color: '#fff',
  '&:hover': {
    backgroundColor: $recording ? '#660000' : '#3c2a21',
  },
  width: '100%',
  padding: '14px',
  marginTop: theme.spacing(2),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'normal',
  boxShadow: 'none',
  borderRadius: '4px',
}));

const TranscriptionBox = styled(Paper)(({ theme }) => ({
  minHeight: 150,
  maxHeight: 300,
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  margin: theme.spacing(2, 0),
}));

const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ready to start');
  const [transcription, setTranscription] = useState('');
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState('');
  const [microphones, setMicrophones] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).substring(7));
  const lastSpeechTimestampRef = useRef(Date.now());
  const translationSourceRef = useRef(null);

  const SPEECH_CONFIG = {
    PAUSE_DURATION: 300,
    MAX_DURATION: 5000,
    FINAL_PAUSE_DURATION: 700,
    MIN_SPEECH_LENGTH: 3,
    MIN_NEW_CHARS: 15,
    MAX_INTERIM_LENGTH: 100,
    SYNTHESIS_DEBOUNCE: 500,
    OVERLAP_BUFFER: 200
  };

  const AUDIO_CONFIG = {
    sampleRate: 16000,
    channelCount: 1,
    processorBufferSize: 8192,
    targetBufferSize: 8192,
    bytesPerSample: 2
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setStatus('Speech recognition is not supported in this browser.');
      setError('Browser not supported');
      return false;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setStatus('Listening...');
      setError('');
      lastSpeechTimestampRef.current = Date.now();
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }, 50);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Recognition error:', event.error);
      if (event.error === 'no-speech' && isRecording) {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Error restarting after no-speech:', e);
          }
        }, 50);
      }
      setError(`Recognition error: ${event.error}`);
    };

    recognitionRef.current.onresult = handleRecognitionResult;
    return true;
  };

  // Initialize microphones
  useEffect(() => {
    const initializeMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput');
        setMicrophones(mics);
        
        if (mics.length === 0) {
          setError('No microphones found');
        } else {
          setError('');
          // Don't auto-select any microphone, keep the default "Choose Microphone..." option
          setSelectedMicrophoneId('');
        }

        // Initialize speech recognition after microphones are set up
        if (!isInitialized) {
          const initialized = initializeSpeechRecognition();
          setIsInitialized(initialized);
        }
      } catch (error) {
        console.error('Error initializing microphones:', error);
        setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      }
    };

    initializeMicrophones();

    navigator.mediaDevices.addEventListener('devicechange', initializeMicrophones);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', initializeMicrophones);
    };
  }, []);

  const handleRecognitionResult = (event) => {
    const currentTime = Date.now();
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript = transcript;
        sendTranslationRequest(transcript, true);
      } else {
        interimTranscript = transcript;
      }
    }

    if (finalTranscript) {
      setTranscription(finalTranscript);
    } else if (interimTranscript) {
      setTranscription(interimTranscript + '...');
    }

    lastSpeechTimestampRef.current = currentTime;
  };

  const sendTranslationRequest = async (text, isFinal) => {
    try {
      await fetch('http://52.189.226.39:4585/translate_realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          clientId: clientIdRef.current,
          isFinal
        })
      });
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation error occurred');
    }
  };

  const initializeTranslationStream = () => {
    if (translationSourceRef.current) {
      translationSourceRef.current.close();
    }

    translationSourceRef.current = new EventSource(
      `http://52.189.226.39:4585/stream_translation/pt?client_id=${clientIdRef.current}&role=broadcaster`
    );

    translationSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.keepalive && data.translation) {
          setTranscription(data.translation);
        }
      } catch (error) {
        console.error('Error processing translation:', error);
      }
    };

    translationSourceRef.current.onerror = (error) => {
      console.error('Translation stream error:', error);
      setError('Translation stream error occurred');
    };
  };

  const startRecording = async () => {
    if (!isInitialized) {
      const initialized = initializeSpeechRecognition();
      if (!initialized) return;
      setIsInitialized(initialized);
    }

    try {
      const response = await fetch('http://52.189.226.39:4585/start_stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceId: selectedMicrophoneId,
          deviceSettings: AUDIO_CONFIG
        })
      });

      if (!response.ok) throw new Error('Failed to start stream');

      // Initialize translation stream before starting recognition
      initializeTranslationStream();

      // Start recognition after stream is initialized
      try {
        await recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
        // If recognition fails to start, try initializing again
        const reinitialized = initializeSpeechRecognition();
        if (reinitialized) {
          await recognitionRef.current.start();
          setIsRecording(true);
        }
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Error starting stream: ' + error.message);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (audioContextRef.current) {
        await audioContextRef.current.suspend();
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (translationSourceRef.current) {
        translationSourceRef.current.close();
      }

      await fetch('http://52.189.226.39:4585/stop_stream', { method: 'POST' });
      setStatus('Stopped');
      setTranscription('');
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Error stopping stream: ' + error.message);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (translationSourceRef.current) {
        translationSourceRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
      <SEO
        title="Live Church Sermon Translator | Real-Time Sermon Translation"
        description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
        keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
        canonical="real-time-sermon-translation"
      />
      <Card>
        <CardContent>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{
              color: '#47362b',
              fontSize: '32px',
              fontWeight: 'normal',
              mb: 4
            }}
          >
            Professional Speech Translation
          </Typography>

          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <FormControl fullWidth>
              <StyledSelect
                value={selectedMicrophoneId}
                onChange={(e) => setSelectedMicrophoneId(e.target.value)}
                disabled={isRecording}
                displayEmpty
              >
                <MenuItem value="">Choose Microphone...</MenuItem>
                {microphones.map((mic) => (
                  <MenuItem key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Microphone ${mic.deviceId.substring(0, 8)}`}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <FormControl fullWidth>
              <StyledSelect
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isRecording}
                displayEmpty
              >
                <MenuItem value="en">English</MenuItem>
              </StyledSelect>
            </FormControl>

            <StyledButton
              variant="contained"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!selectedMicrophoneId || !isInitialized}
              $recording={isRecording}
            >
              {isRecording ? 'Stop' : 'Start Speaking'}
            </StyledButton>
          </Box>

          {status && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
              {status}
            </Typography>
          )}

          {error && (
            <Typography variant="body2" align="center" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Transcription
              </Typography>
              <TranscriptionBox>
                {transcription || 'Your transcription will appear here...'}
              </TranscriptionBox>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GoLive;
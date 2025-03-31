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

// Styled components
const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    color: '#fff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  backgroundColor: '#3C2A21',
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme, $recording }) => ({
  backgroundColor: $recording ? '#8B0000' : '#3C2A21',
  color: '#fff',
  '&:hover': {
    backgroundColor: $recording ? '#660000' : '#4C3628',
  },
  width: '100%',
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
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
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ready to start');
  const [transcription, setTranscription] = useState('');
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState('');
  const [microphones, setMicrophones] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Refs for maintaining values between renders
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).substring(7));
  const lastSpeechTimestampRef = useRef(Date.now());
  const translationSourceRef = useRef(null);

  // Constants
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

  // Audio configuration
  const AUDIO_CONFIG = {
    sampleRate: 16000,
    channelCount: 1,
    processorBufferSize: 8192,
    targetBufferSize: 8192,
    bytesPerSample: 2
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
        }
      } catch (error) {
        console.error('Error initializing microphones:', error);
        setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      }
    };

    initializeMicrophones();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', initializeMicrophones);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', initializeMicrophones);
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
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
          setTimeout(() => recognitionRef.current.start(), 50);
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === 'no-speech' && isRecording) {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 50);
        }
        setError(`Recognition error: ${event.error}`);
        console.error('Recognition error:', event.error);
      };

      recognitionRef.current.onresult = handleRecognitionResult;
    } else {
      setStatus('Speech recognition is not supported in this browser.');
      setError('Browser not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // Handle recognition results
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

  // Send translation request
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

  // Start recording
  const startRecording = async () => {
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

      setIsRecording(true);
      recognitionRef.current.start();
      initializeTranslationStream();
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Error starting stream: ' + error.message);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      recognitionRef.current.stop();

      if (audioContextRef.current) {
        await audioContextRef.current.suspend();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (translationSourceRef.current) {
        translationSourceRef.current.close();
      }

      await fetch('/stop_stream', { method: 'POST' });
      setStatus('Stopped');
      setTranscription('');
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Error stopping stream: ' + error.message);
    }
  };

  // Initialize translation stream
  const initializeTranslationStream = () => {
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

  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
         <SEO
        title="Live Church Sermon Translator | Real-Time Sermon Translation"
        description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
        keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
        // canonical="https://churchtranslator.com/live-sermon-translator"
        canonical="real-time-sermon-translation"
      />
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Professional Speech Translation
          </Typography>

          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#fff' }}>Choose Microphone</InputLabel>
              <StyledSelect
                value={selectedMicrophoneId}
                onChange={(e) => setSelectedMicrophoneId(e.target.value)}
                disabled={isRecording}
                label="Choose Microphone"
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
              <InputLabel sx={{ color: '#fff' }}>Language</InputLabel>
              <StyledSelect
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isRecording}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
              </StyledSelect>
            </FormControl>

            <StyledButton
              variant="contained"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!selectedMicrophoneId}
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
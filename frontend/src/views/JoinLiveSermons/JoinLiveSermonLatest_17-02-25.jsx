import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Select, MenuItem, Container, Paper, styled } from '@mui/material';

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}));

const ControlsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px'
});

const StyledSelect = styled(Select)({
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  minWidth: '150px',
  '& .MuiSelect-select': {
    padding: '12px 24px',
    fontSize: '16px'
  }
});

const StyledButton = styled(Button)(({ $isStop }) => ({
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: $isStop ? '#f44336' : '#4CAF50',
  color: 'white',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: $isStop ? '#da190b' : '#45a049'
  },
  '&:disabled': {
    backgroundColor: '#cccccc'
  }
}));

const StatusText = styled(Typography)({
  textAlign: 'center',
  margin: '10px 0',
  color: '#666'
});

const ErrorText = styled(Typography)({
  color: '#f44336',
  textAlign: 'center',
  margin: '10px 0',
  fontSize: '14px',
  minHeight: '20px'
});

const VoiceInfoText = styled(Typography)({
  textAlign: 'center',
  margin: '10px 0',
  color: '#666',
  fontSize: '14px'
});

const TranscriptionBox = styled(Paper)({
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '20px',
  height: '300px',
  overflowY: 'auto',
  fontSize: '18px',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
});

// Audio Manager Class for handling speech playback
class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
  }

  async playAudio(audioBlob) {
    try {
      // Stop any currently playing audio
      if (this.currentAudio) {
        this.stopAudio();
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          this.isPlaying = false;
          resolve();
        };

        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          this.isPlaying = false;
          reject(error);
        };

        audio.play().then(() => {
          this.isPlaying = true;
        }).catch(reject);
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }
}

const API_BASE_URL = 'http://52.189.226.39:4585';

const VOICE_MAP = {
  'pt': {
    voice: 'pt-BR-AntonioNeural',
    name: 'Microsoft Azure pt-BR-AntonioNeural'
  },
  'es': {
    voice: 'es-ES-AlvaroNeural',
    name: 'Microsoft Azure es-ES-AlvaroNeural'
  },
  'id': {
    voice: 'id-ID-ArdiNeural',
    name: 'Microsoft Azure id-ID-ArdiNeural'
  },
  'zh': {
    voice: 'zh-CN-YunxiNeural',
    name: 'Microsoft Azure zh-CN-YunxiNeural'
  },
  'ar': {
    voice: 'ar-SA-HamedNeural',
    name: 'Microsoft Azure ar-SA-HamedNeural'
  },
  'en': {
    voice: 'en-US-Default',
    name: 'System default'
  }
};

const JoinLiveSermons = () => {
  const [status, setStatus] = useState('Ready to start');
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceInfo, setVoiceInfo] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const clientIdRef = useRef(generateUUID());
  const audioManagerRef = useRef(new AudioManager());
  const lastTranslationRef = useRef('');
  const eventSourceRef = useRef(null);
  const isSpeakingRef = useRef(false);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'id', label: 'Indonesian' },
    { value: 'zh', label: 'Mandarin' },
    { value: 'ar', label: 'Arabic' }
  ];

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Update voice info when language changes
  function updateVoiceInfo(language) {
    setVoiceInfo(`Using ${VOICE_MAP[language].name}`);
  }

  // Speech synthesis function
  const synthesizeSpeech = async (text, language) => {
    if (!text.trim() || isSpeakingRef.current) return;
    
    try {
        isSpeakingRef.current = true;
        const requestData = {
            text,
            language,
            // Send only needed parameters
            clientId: clientIdRef.current,
            isFinal: true
        };
        
        console.log('[SPEECH] Request:', requestData);
        
        // First, send translation request
        const translationResponse = await fetch(`${API_BASE_URL}/translate_realtime`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!translationResponse.ok) {
            throw new Error('Translation failed');
        }

        // Then request speech synthesis
        const synthesisResponse = await fetch(`${API_BASE_URL}/synthesize_speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                language: language
            })
        });

        if (!synthesisResponse.ok) {
            throw new Error('Speech synthesis failed');
        }

        const audioBlob = await synthesisResponse.blob();
        if (audioBlob.size === 0) {
            throw new Error('Empty audio response');
        }

        await audioManagerRef.current.playAudio(audioBlob);
    } catch (error) {
        console.error('[SPEECH] Error:', error);
        setError(`Speech error: ${error.message}`);
    } finally {
        isSpeakingRef.current = false;
    }
};

  // Connect to translation stream
  const connectTranslationStream = () => {
    if (eventSourceRef.current) {
        eventSourceRef.current.close();
    }

    const streamUrl = `${API_BASE_URL}/stream_translation/${selectedLanguage}?client_id=${clientIdRef.current}&role=listener`;
    console.log('[STREAM] Connecting to:', streamUrl);
    
    eventSourceRef.current = new EventSource(streamUrl);
    
    eventSourceRef.current.onmessage = async (event) => {
        const mainStart = performance.now();
        console.log(`[MAIN] Message received`);
        
        try {
            const data = JSON.parse(event.data);
            if (!data.keepalive && data.translation) {
                // Always update text immediately
                setTranscription(data.translation);

                // Process speech for final translations
                if (data.type === 'final' && !isSpeakingRef.current) {
                    console.log(`[TEXT] Processing final translation`);
                    lastTranslationRef.current = data.translation;
                    
                    try {
                        const response = await fetch(`${API_BASE_URL}/synthesize_speech`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                text: data.translation,
                                language: selectedLanguage
                            })
                        });
                        
                        const audioBlob = await response.blob();
                        await audioManagerRef.current.playAudio(audioBlob);
                    } catch (error) {
                        console.error(`[ERROR] Audio processing error:`, error);
                    }
                }
            }
        } catch (error) {
            console.error(`[ERROR] Message processing error:`, error);
        }
    };

    eventSourceRef.current.onopen = () => {
        console.log('[STREAM] Connected successfully');
        setStatus('Connected');
    };

    eventSourceRef.current.onerror = (error) => {
        console.error('[STREAM] Error:', error);
        setStatus('Connection lost. Please refresh the page.');
    };
};

  // Start streaming
  const handleStart = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/start_stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientIdRef.current,
                role: 'listener'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to start stream');
        }

        setIsStreaming(true);
        setStatus('Connecting...');
        setError('');
        setTranscription('');
        lastTranslationRef.current = '';
        isSpeakingRef.current = false;
        
        connectTranslationStream();
    } catch (error) {
        console.error('[ERROR] Start error:', error);
        setError('Failed to start streaming');
        setIsStreaming(false);
    }
};

  // Stop streaming
  const handleStop = async () => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      audioManagerRef.current.stopAudio();
      isSpeakingRef.current = false;

      await fetch(`${API_BASE_URL}/stop_stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: clientIdRef.current
        })
      });

      setIsStreaming(false);
      setStatus('Disconnected');
      setTranscription('');
    } catch (error) {
      console.error('[ERROR] Stop error:', error);
      setError('Failed to stop streaming');
    }
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    updateVoiceInfo(newLanguage);
    lastTranslationRef.current = '';
    
    if (isStreaming) {
      connectTranslationStream();
    }
  };

  // Initialize voice info
  useEffect(() => {
    updateVoiceInfo(selectedLanguage);
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (audioManagerRef.current) {
        audioManagerRef.current.stopAudio();
      }
    };
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Live Sermon Translator
      </Typography>
      
      <ControlsBox>
        <StyledSelect
          value={selectedLanguage}
          onChange={handleLanguageChange}
          disabled={isStreaming}
        >
          {languageOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledSelect>
        
        {!isStreaming ? (
          <StyledButton onClick={handleStart}>
            Join Live Sermon
          </StyledButton>
        ) : (
          <StyledButton onClick={handleStop} $isStop>
            Leave Sermon
          </StyledButton>
        )}
      </ControlsBox>

      <StatusText>{status}</StatusText>
      <ErrorText>{error}</ErrorText>
      <VoiceInfoText>{voiceInfo}</VoiceInfoText>

      <TranscriptionBox>
        {transcription || 'Waiting for sermon to begin...'}
      </TranscriptionBox>
    </StyledContainer>
  );
};

export default JoinLiveSermons;
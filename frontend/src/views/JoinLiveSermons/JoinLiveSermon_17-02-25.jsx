import React, { useState, useEffect, useContext, useRef } from 'react';
import Select from 'react-select';
import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import '../../index.scss';
import { UserContext } from '../../contexts/UserContext';
import SEO from 'views/Seo/SeoMeta';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'id', label: 'Indonesian' },
  { value: 'zh', label: 'Mandarin' },
  { value: 'ar', label: 'Arabic' }
];

// All styled components
const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: '#f9fafc',
  width: '100%'
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0px 4px 10px #231f20',
  '&.bg-b': {
    backgroundColor: '#231f20',
    '&:hover': {
      backgroundColor: '#3d3d3d'
    }
  }
}));

const TranscriptionContainer = styled(Paper)(({ theme }) => ({
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  height: '300px',
  overflowY: 'auto',
  fontSize: '18px',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
}));

const VoiceInfo = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  margin: '10px 0',
  color: '#666',
  fontSize: '14px'
}));

const JoinLiveSermon = () => {
  const { user } = useContext(UserContext);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [isSermonActive, setIsSermonActive] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [voiceInfo, setVoiceInfo] = useState('');
  const transcriptionEventSourceRef = useRef(null);
  const translationEventSourceRef = useRef(null);
  const clientId = useRef(generateUUID()).current;
  const synth = window.speechSynthesis;
  const currentAudioRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const isSpeakingRef = useRef(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const stopAllSpeech = async () => {
    return new Promise((resolve) => {
      try {
        // Stop and cleanup Azure audio
        if (currentAudioRef.current) {
          currentAudioRef.current.onended = null; // Remove event listener
          currentAudioRef.current.onerror = null; // Remove event listener
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
          currentAudioRef.current.src = ''; // Clear source
          currentAudioRef.current = null;
        }

        // Force stop any web speech synthesis
        window.speechSynthesis.cancel();

        // Reset all state flags
        isSpeakingRef.current = false;
        lastSpokenTextRef.current = '';

        // Small delay to ensure cleanup
        setTimeout(resolve, 100);
      } catch (error) {
        console.error('Error stopping speech:', error);
        resolve(); // Resolve even on error
      }
    });
  };

  const updateVoiceInfo = (language) => {
    switch (language) {
      case 'pt':
        setVoiceInfo('Using Microsoft Azure pt-BR-AntonioNeural voice');
        break;
      case 'es':
        setVoiceInfo('Using Microsoft Azure es-ES-AlvaroNeural voice');
        break;
      case 'id':
        setVoiceInfo('Using Microsoft Azure id-ID-ArdiNeural voice');
        break;
      case 'zh':
        setVoiceInfo('Using Microsoft Azure zh-CN-YunxiNeural voice');
        break;
      case 'ar':
        setVoiceInfo('Using Microsoft Azure ar-SA-HamedNeural voice');
        break;
      default:
        setVoiceInfo('Using system default voice');
    }
  };

  const speakText = async (text) => {
    if (!text.trim() || text === lastSpokenTextRef.current || isSpeakingRef.current) return;
    lastSpokenTextRef.current = text;

    try {
      await stopAllSpeech();
      isSpeakingRef.current = true;

      const language = selectedLanguage.value;

      if (['pt', 'es', 'id', 'zh', 'ar'].includes(language)) {
        const response = await fetch('http://52.189.226.39:4585/synthesize_speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            language: language
          })
        });

        if (!response.ok) {
          throw new Error('Speech synthesis failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        // For Spanish and Portuguese
        return new Promise((resolve, reject) => {
          const audio = new Audio(audioUrl);
          console.log('AUDIO', audio);
          currentAudioRef.current = audio;

          const cleanupAudio = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            isSpeakingRef.current = false;
          };

          audio.onended = () => {
            cleanupAudio();
            resolve();
          };

          audio.onerror = (error) => {
            cleanupAudio();
            reject(error);
          };

          audio.play().catch((error) => {
            cleanupAudio();
            reject(error);
          });
        });
      } else {
        // for English,
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          console.log('UTTERANCE', utterance);
          utterance.onend = () => {
            isSpeakingRef.current = false;
            resolve();
          };

          utterance.onerror = (event) => {
            isSpeakingRef.current = false;
            reject(event);
          };

          synth.speak(utterance);
        });
      }
    } catch (error) {
      console.error('Speech error:', error);
      isSpeakingRef.current = false;
      setError(`Error during speech synthesis: ${error.message}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const connectEventSource = () => {
    if (transcriptionEventSourceRef.current) {
      transcriptionEventSourceRef.current.close();
    }

    transcriptionEventSourceRef.current = new EventSource('http://52.189.226.39:4585/stream_transcription?client_id=' + clientId);
    let lastTranscription = '';
    // console.log("TranscriptionEventSource1",transcriptionEventSourceRef.current)
    transcriptionEventSourceRef.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.keepalive && data.transcription) {
          const targetLanguage = selectedLanguage.value;
          const trimmedText = data.transcription.trim();
          const isFinal = data.is_final;

          if (targetLanguage === 'en') {
            if (trimmedText !== lastTranscription) {
              setCurrentTranscription(trimmedText);
              if (isFinal && trimmedText) {
                lastTranscription = trimmedText;
                await speakText(trimmedText);
              }
            }
          } else {
            try {
              const response = await fetch('http://52.189.226.39:4585/translate_realtime', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  text: trimmedText,
                  targetLanguage: targetLanguage,
                  clientId: clientId,
                  isFinal: isFinal
                })
              });

              if (!response.ok) {
                throw new Error('Translation request failed');
              }
            } catch (error) {
              console.error('Translation error:', error);
              setError('Error processing translation');
              setTimeout(() => setError(null), 2000);
            }
          }
        }
      } catch (error) {
        console.error('Transcription processing error:', error);
      }
    };

    transcriptionEventSourceRef.current.onerror = () => {
      setError('Connection lost. Reconnecting...');
      transcriptionEventSourceRef.current.close();
      setTimeout(connectEventSource, 2000);
    };
  };

  const connectTranslationStream = (targetLanguage) => {
    console.log(`Connecting translation stream for language: ${targetLanguage}`);
    console.log(`Client ID: ${clientId}, Role: listener`);

    if (translationEventSourceRef.current) {
      console.log('Closing existing translation stream');
      translationEventSourceRef.current.close();
    }

    // translationEventSourceRef.current = new EventSource(
    //   `http://52.189.226.39:4585/stream_translation/${targetLanguage}?client_id=${clientId}&role=listener`
    // );
    // console.log("Connecting to stream:", streamUrl);

    // Add proper connection logging
    const streamUrl = `http://52.189.226.39:4585/stream_translation/${targetLanguage}?client_id=${clientId}&role=listener`;
    console.log('Connecting to stream:', streamUrl);

    translationEventSourceRef.current = new EventSource(streamUrl);

    // Add this line
    translationEventSourceRef.current.onopen = () => {
      console.log(`Translation stream connected successfully for ${targetLanguage}`);
      setSuccess(`Connected to ${targetLanguage} translation stream`);
    };

    let lastTranslation = '';

    translationEventSourceRef.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.keepalive) {
          if (data.type === 'partial') {
            setCurrentTranscription(data.translation);
          } else if (data.type === 'final' && data.translation) {
            if (data.translation !== lastTranslation) {
              setCurrentTranscription(data.translation);
              lastTranslation = data.translation;
              await speakText(data.translation);
            }
          }
        }
      } catch (error) {
        console.error('Translation processing error:', error);
      }
    };

    translationEventSourceRef.current.onerror = () => {
      console.error('Translation stream error:', error);
      setError('Translation connection lost. Reconnecting...');
      translationEventSourceRef.current.close();
      setTimeout(() => connectTranslationStream(targetLanguage), 2000);
    };
  };

  // Modified handleJoinSermon function - now it just connects to the streams without mic access
  const handleJoinSermon = () => {
    setError(null);
    setIsSermonActive(true);
    setCurrentTranscription('');

    // Connect to transcription stream
    connectEventSource();

    // Connect to translation stream if not English
    if (selectedLanguage.value !== 'en') {
      connectTranslationStream(selectedLanguage.value);
    }
  };

  const handleLeaveSermon = () => {
    fetch('http://52.189.226.39:4585/stop_stream', { method: 'POST' })
      .then(() => {
        setIsSermonActive(false);
        if (transcriptionEventSourceRef.current) {
          transcriptionEventSourceRef.current.close();
          transcriptionEventSourceRef.current = null;
        }
        if (translationEventSourceRef.current) {
          translationEventSourceRef.current.close();
          translationEventSourceRef.current = null;
        }
        setCurrentTranscription('');
        stopAllSpeech();
        lastSpokenTextRef.current = '';
      })
      .catch((error) => {
        setError('Error stopping stream: ' + error.message);
        console.error(error);
      });
  };

  const handleLanguageChange = async (selectedOption) => {
    console.log(`Language changed to: ${selectedOption.label} (${selectedOption.value})`);
    try {
      // Disable language selection during switch
      setIsChangingLanguage(true);
      console.log('Stopping current speech and streams...');
      // First stop all audio and cleanup
      await stopAllSpeech();

      // Force close and cleanup existing streams
      if (transcriptionEventSourceRef.current) {
        transcriptionEventSourceRef.current.onmessage = null;
        transcriptionEventSourceRef.current.onerror = null;
        transcriptionEventSourceRef.current.close();
        transcriptionEventSourceRef.current = null;
      }

      if (translationEventSourceRef.current) {
        translationEventSourceRef.current.onmessage = null;
        translationEventSourceRef.current.onerror = null;
        translationEventSourceRef.current.close();
        translationEventSourceRef.current = null;
      }

      // Clear all states
      setCurrentTranscription('');
      setError(null);
      lastSpokenTextRef.current = '';

      // Update language
      setSelectedLanguage(selectedOption);
      updateVoiceInfo(selectedOption.value);

      // If sermon is active, handle stream reconnection
      if (isSermonActive) {
        // Close previous streams completely
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (selectedOption.value === 'en') {
          // English only needs transcription
          await connectEventSource();
        } else {
          // Other languages need both streams
          await connectEventSource();
          // Wait for transcription to establish
          await new Promise((resolve) => setTimeout(resolve, 500));
          await connectTranslationStream(selectedOption.value);
        }

        setSuccess(`Switched to ${selectedOption.label} successfully`);
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (error) {
      console.error('Error switching language:', error);
      setError('Failed to switch language. Please try again.');
    } finally {
      setIsChangingLanguage(false);
    }
  };

  useEffect(() => {
    updateVoiceInfo(selectedLanguage.value);
    return () => {
      if (transcriptionEventSourceRef.current) {
        transcriptionEventSourceRef.current.close();
      }
      if (translationEventSourceRef.current) {
        translationEventSourceRef.current.close();
      }
      stopAllSpeech();
    };
  }, []);

  return (
    <>
      <SEO
        title="Live Church Sermon Translator | Real-Time Sermon Translation"
        description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
        keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
        // canonical="https://churchtranslator.com/live-sermon-translator"
        canonical="http://localhost:3000/live-sermon-translator"
      />

      <StyledBox>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
          Live Sermon Translator {isSermonActive ? '(Active)' : ''}
        </Typography>

        {error && (
          <Paper elevation={1} style={{ backgroundColor: '#ffebee', padding: '1rem', marginBottom: '1rem' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {success && (
          <Paper elevation={1} style={{ backgroundColor: '#e8f5e9', padding: '1rem', marginBottom: '1rem' }}>
            <Typography color="success">{success}</Typography>
          </Paper>
        )}

        <CustomPaper elevation={3}>
          <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
            Select Your Preferred Language
          </Typography>

          <FormControl fullWidth>
            <Select value={selectedLanguage} onChange={handleLanguageChange} options={languageOptions} isDisabled={isChangingLanguage} />
          </FormControl>

          <VoiceInfo>{voiceInfo}</VoiceInfo>

          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            {!isSermonActive ? (
              <StyledButton variant="contained" className="bg-b" onClick={handleJoinSermon}>
                Join Live Sermon
              </StyledButton>
            ) : (
              <StyledButton variant="contained" className="bg-b" onClick={handleLeaveSermon} style={{ backgroundColor: '#dc3545' }}>
                Leave Sermon
              </StyledButton>
            )}
          </Box>
        </CustomPaper>

        {isSermonActive && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
              Live Transcription ({selectedLanguage.label}):
            </Typography>
            <TranscriptionContainer>
              <Typography variant="body1" style={{ color: '#231f20' }}>
                {currentTranscription || 'Waiting for transcription...'}
              </Typography>
            </TranscriptionContainer>
          </Box>
        )}
      </StyledBox>
    </>
  );
};

export default JoinLiveSermon;

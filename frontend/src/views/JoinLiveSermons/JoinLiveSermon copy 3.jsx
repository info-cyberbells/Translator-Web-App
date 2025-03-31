import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import '../../index.scss';
import { UserContext } from '../../contexts/UserContext';
import { TranscriptionContext } from '../../contexts/TranscriptionContext';

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mandarin', label: 'Mandarin' }
];

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

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '8px',
    padding: '6px',
    boxShadow: '0 0 5px #231f20'
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#231f20',
    backgroundColor: state.isFocused ? '#e0e0e0' : 'white',
    '&:hover': {
      backgroundColor: '#d0d0d0'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#231f20'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#231f20'
  })
};

const JoinLiveSermon = () => {
  const { user } = useContext(UserContext);
  const { transcription } = useContext(TranscriptionContext);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [isSermonActive, setIsSermonActive] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
console.log(transcription)
console.log(user)
  // Listen for transcription changes
  useEffect(() => {
    console.log('JoinLiveSermon - Received transcription:', transcription);
    if (transcription && isSermonActive) {
      setCurrentTranscription(transcription);
      handleTextToSpeech(transcription);
    }
  }, [transcription, isSermonActive]);

  const handleTextToSpeech = (text) => {
    if (!text || !isSermonActive) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const languageCodeMap = {
        english: 'en-US',
        spanish: 'es-ES',
        french: 'fr-FR',
        german: 'de-DE',
        italian: 'it-IT',
        hindi: 'hi-IN',
        mandarin: 'zh-CN'
      };

      utterance.lang = languageCodeMap[selectedLanguage.value] || 'en-US';
      console.log('Speaking in language:', utterance.lang);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
        setSuccess('Speaking transcription...');
        setTimeout(() => setSuccess(null), 2000);
      } else {
        throw new Error('Speech synthesis not supported in this browser');
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError('Failed to speak text: ' + err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption || languageOptions[0]);
    console.log('Language changed to:', selectedOption?.label);
  };

  const handleJoinSermon = () => {
    try {
      setIsSermonActive(true);
      // If there's already a transcription, display it immediately
      if (transcription) {
        setCurrentTranscription(transcription);
        handleTextToSpeech(transcription);
      }
      setSuccess(`Joined sermon in ${selectedLanguage.label}!`);
      setTimeout(() => setSuccess(null), 2000);
      alert(`${user?.value || 'User'} Joining sermon in ${selectedLanguage.label}!`);
    } catch (err) {
      console.error('Error joining sermon:', err);
      setError('Failed to join sermon');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLeaveSermon = () => {
    try {
      setIsSermonActive(false);
      setCurrentTranscription('');
      window.speechSynthesis.cancel();
      setSuccess('Left sermon successfully');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error leaving sermon:', err);
      setError('Failed to leave sermon');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <StyledBox>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
        Available Live Sermons {isSermonActive ? '(Active)' : ''}
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
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            options={languageOptions}
            placeholder="Select a language"
            styles={customStyles}
            isClearable
            defaultValue={languageOptions[0]}
            isDisabled={isSermonActive}
          />
        </FormControl>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {!isSermonActive ? (
            <StyledButton 
              variant="contained" 
              className="bg-b" 
              onClick={handleJoinSermon}
            >
              Join Live Sermon
            </StyledButton>
          ) : (
            <StyledButton 
              variant="contained" 
              className="bg-b" 
              onClick={handleLeaveSermon}
              style={{ backgroundColor: '#dc3545' }}
            >
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
          <Paper 
            elevation={2} 
            style={{ 
              padding: '1rem', 
              backgroundColor: '#f8f9fa',
              minHeight: '100px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            <Typography variant="body1" style={{ color: '#231f20' }}>
              {currentTranscription || 'Waiting for transcription...'}
            </Typography>
          </Paper>
        </Box>
      )}

      {isSermonActive && (
        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="caption" color="textSecondary">
            Listening for live transcription in {selectedLanguage.label}
          </Typography>
        </Box>
      )}
    </StyledBox>
  );
};

export default JoinLiveSermon;
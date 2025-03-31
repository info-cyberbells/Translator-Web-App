import React, { useState } from 'react';
import Select from 'react-select';
import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import '../../index.scss'

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mandarin', label: 'Mandarin' },
];

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: '#f9fafc',
  width: '100%',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
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
      backgroundColor: '#3d3d3d',
    }
  }
}));

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '8px',
    padding: '6px',
    boxShadow: '0 0 5px #231f20',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#231f20',
    backgroundColor: state.isFocused ? '#e0e0e0' : 'white',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#231f20',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#231f20',
  }),
};

const LiveSermons = () => {
  // Initialize with English selected by default
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);

  const handleLanguageChange = (selectedOption) => {
    // If user clears the selection, default back to English
    setSelectedLanguage(selectedOption || languageOptions[0]);
  };

  const handleJoinSermon = () => {
    alert(`Joining sermon in ${selectedLanguage.label}!`);
  };

  return (
    <StyledBox>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
        Available Live Sermons
      </Typography>

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
            defaultValue={languageOptions[0]} // Set English as default
          />
        </FormControl>
        <Box mt={4} display="flex" justifyContent="center">
          <StyledButton
            variant="contained"
            className="bg-b"
            onClick={handleJoinSermon}
            // Removed disabled prop to keep button always enabled
          >
            Join Live Sermon
          </StyledButton>
        </Box>
      </CustomPaper>
    </StyledBox>
  );
};

export default LiveSermons;
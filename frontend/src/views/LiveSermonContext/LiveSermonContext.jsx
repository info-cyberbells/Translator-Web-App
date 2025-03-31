import React, { createContext, useContext, useState } from 'react';

const LiveSermonContext = createContext();

export const LiveSermonProvider = ({ children }) => {
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [error, setError] = useState('');

  const value = {
    recordingCompleted,
    setRecordingCompleted,
    selectedLanguage,
    setSelectedLanguage,
    error,
    setError
  };

  return (
    <LiveSermonContext.Provider value={value}>
      {children}
    </LiveSermonContext.Provider>
  );
};

export const useLiveSermon = () => {
  const context = useContext(LiveSermonContext);
  if (!context) {
    throw new Error('useLiveSermon must be used within a LiveSermonProvider');
  }
  return context;
};
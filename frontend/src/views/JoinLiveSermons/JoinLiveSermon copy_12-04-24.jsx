// import React, { useState, useEffect, useContext, useRef } from 'react';
// import Select from 'react-select';
// import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import '../../index.scss';
// import { UserContext } from '../../contexts/UserContext';

// const languageOptions = [
//   { value: 'en', label: 'English' },
//   { value: 'es', label: 'Spanish' },
//   { value: 'pt', label: 'Portuguese' },
//   // Add other languages as needed
// ];

// const CustomPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   backgroundColor: '#f9fafc',
//   width: '100%',
// }));

// const StyledBox = styled(Box)(({ theme }) => ({
//   width: '100%',
//   maxWidth: '1000px',
//   margin: 'auto',
//   padding: theme.spacing(4),
//   backgroundColor: '#ffffff',
//   borderRadius: '16px',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   padding: '10px 20px',
//   fontSize: '16px',
//   borderRadius: '8px',
//   textTransform: 'none',
//   boxShadow: '0px 4px 10px #231f20',
//   '&.bg-b': {
//     backgroundColor: '#231f20',
//     '&:hover': {
//       backgroundColor: '#3d3d3d',
//     },
//   },
// }));

// const customStyles = {
//   control: (base) => ({
//     ...base,
//     borderRadius: '8px',
//     padding: '6px',
//     boxShadow: '0 0 5px #231f20',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     color: '#231f20',
//     backgroundColor: state.isFocused ? '#e0e0e0' : 'white',
//     '&:hover': {
//       backgroundColor: '#d0d0d0',
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: '#231f20',
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: '#231f20',
//   }),
// };

// const JoinLiveSermon = () => {
//   const { user } = useContext(UserContext);
//   const [currentTranscription, setCurrentTranscription] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
//   const [isSermonActive, setIsSermonActive] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const transcriptionEventSourceRef = useRef(null);
//   const translationEventSourceRef = useRef(null);
//   const clientId = useRef(generateUUID()).current;
//   const synth = window.speechSynthesis;
//   const [availableVoices, setAvailableVoices] = useState([]);
//   const isSpeakingRef = useRef(false);

//   // Function to generate UUID
//   function generateUUID() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//       const r = (Math.random() * 16) | 0,
//         v = c === 'x' ? r : (r & 0x3) | 0x8;
//       return v.toString(16);
//     });
//   }

//   // Initialize voices
//   useEffect(() => {
//     const initVoices = () => {
//       setAvailableVoices(synth.getVoices());
//     };

//     if (synth.onvoiceschanged !== undefined) {
//       synth.onvoiceschanged = initVoices;
//     }

//     initVoices();
//   }, [synth]);

//   const languageVoiceMap = {
//     en: ['en-US', 'en-AU'],
//     es: ['es-ES'],
//     pt: ['pt-PT'],
//     // Add other languages and their locales as needed
//   };

//   const findVoiceForLanguage = (language) => {
//     try {
//       if (language === 'pt') {
//         return null; // Use Azure TTS for Portuguese
//       }

//       const preferredLocales = languageVoiceMap[language] || [language];
//       for (const locale of preferredLocales) {
//         const voice = availableVoices.find((v) =>
//           v.lang.toLowerCase().startsWith(locale.toLowerCase())
//         );
//         if (voice) return voice;
//       }

//       return (
//         availableVoices.find((v) =>
//           v.lang.toLowerCase().startsWith(language.toLowerCase())
//         ) || null
//       );
//     } catch (error) {
//       console.error('Error finding voice:', error);
//       return null;
//     }
//   };

//   const speakText = async (text) => {
//     if (!text.trim()) return;

//     try {
//       const language = selectedLanguage.value;

//       if (language === 'pt') {
//         // Handle Azure TTS for Portuguese
//         try {
//           const response = await fetch('http://127.0.0.1:2296/azure_tts', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               text: text,
//               voiceId: 'pt-BR-AntonioNeural',
//             }),
//           });

//           if (!response.ok) {
//             throw new Error('Azure TTS request failed');
//           }

//           const audioBlob = await response.blob();
//           const audioUrl = URL.createObjectURL(audioBlob);
//           const audio = new Audio(audioUrl);

//           await new Promise((resolve, reject) => {
//             audio.onended = () => {
//               URL.revokeObjectURL(audioUrl);
//               resolve();
//             };
//             audio.onerror = (e) => {
//               URL.revokeObjectURL(audioUrl);
//               reject(e);
//             };
//             audio.play().catch(reject);
//           });
//         } catch (error) {
//           console.error('Azure TTS error:', error);
//           setError('Error with Portuguese speech synthesis');
//         }
//         return;
//       }

//       synth.cancel();
//       await new Promise((resolve, reject) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         const voice = findVoiceForLanguage(language);

//         if (voice) {
//           utterance.voice = voice;
//           utterance.lang = voice.lang;
//         } else {
//           utterance.lang = languageVoiceMap[language]?.[0] || language;
//         }

//         utterance.rate = 1.0;
//         utterance.pitch = 1.0;
//         utterance.volume = 1.0;

//         utterance.onend = resolve;
//         utterance.onerror = reject;

//         synth.speak(utterance);
//       });
//     } catch (error) {
//       console.error('Speech error:', error);
//       setError('Speech synthesis error');
//     }
//   };

//   const connectEventSource = () => {
//     if (transcriptionEventSourceRef.current) {
//       transcriptionEventSourceRef.current.close();
//     }

//     let currentPartialText = '';
//     let finalizedText = '';
//     transcriptionEventSourceRef.current = new EventSource('http://127.0.0.1:2296/stream_transcription');

//     transcriptionEventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive && data.transcription) {
//           const targetLanguage = selectedLanguage.value;
//           const trimmedText = data.transcription.trim();
//           const isFinal = data.is_final;

//           if (targetLanguage === 'en') {
//             if (isFinal) {
//               finalizedText = finalizedText + (finalizedText ? '\n' : '') + trimmedText;
//               currentPartialText = '';
//               setCurrentTranscription(finalizedText);
//               await speakText(trimmedText);
//             } else {
//               currentPartialText = trimmedText;
//               setCurrentTranscription(finalizedText + (finalizedText ? '\n' : '') + currentPartialText);
//             }
//           } else {
//             try {
//               const response = await fetch('http://127.0.0.1:2296/translate_realtime', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   text: trimmedText,
//                   targetLanguage: targetLanguage,
//                   clientId: clientId,
//                   isFinal: isFinal,
//                 }),
//               });

//               if (!response.ok) {
//                 throw new Error('Translation request failed');
//               }
//             } catch (error) {
//               console.error('Real-time translation error:', error);
//               setError('Translation error: ' + error.message);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Transcription processing error:', error);
//       }
//     };

//     transcriptionEventSourceRef.current.onerror = () => {
//       setError('Connection lost. Reconnecting... Please Wait');
//       transcriptionEventSourceRef.current.close();
//       setTimeout(connectEventSource, 2000);
//     };
//   };

//   const connectTranslationStream = (targetLanguage) => {
//     if (translationEventSourceRef.current) {
//       translationEventSourceRef.current.close();
//     }

//     let currentPartialTranslation = '';
//     let finalizedTranslation = '';
//     translationEventSourceRef.current = new EventSource(
//       `http://127.0.0.1:2296/stream_translation/${targetLanguage}?client_id=${clientId}`
//     );

//     translationEventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive) {
//           if (data.partial_translation) {
//             currentPartialTranslation = data.partial_translation;
//             setCurrentTranscription(
//               finalizedTranslation + (finalizedTranslation ? '\n' : '') + currentPartialTranslation
//             );
//           } else if (data.final_translation) {
//             finalizedTranslation =
//               finalizedTranslation + (finalizedTranslation ? '\n' : '') + data.final_translation;
//             currentPartialTranslation = '';
//             setCurrentTranscription(finalizedTranslation);
//             await speakText(data.final_translation);
//           }
//         }
//       } catch (error) {
//         console.error('Translation processing error:', error);
//       }
//     };

//     translationEventSourceRef.current.onerror = (error) => {
//       console.error('Translation stream error:', error);
//       setError('Translation connection lost. Reconnecting...');
//       translationEventSourceRef.current.close();
//       setTimeout(() => {
//         connectTranslationStream(targetLanguage);
//       }, 2000);
//     };
//   };

//   const handleJoinSermon = () => {
//     setError(null);
//     synth.cancel();
//     isSpeakingRef.current = false;

//     fetch('http://127.0.0.1:2296/start_stream', { method: 'POST' })
//       .then((response) => {
//         if (!response.ok) throw new Error('Failed to start stream');
//         setIsSermonActive(true);
//         setSuccess('Joined sermon successfully!');
//         setTimeout(() => setSuccess(null), 2000);

//         connectEventSource();

//         const targetLanguage = selectedLanguage.value;
//         if (targetLanguage !== 'en') {
//           connectTranslationStream(targetLanguage);
//         }
//       })
//       .catch((error) => {
//         setError('Error joining sermon: ' + error.message);
//         console.error(error);
//       });
//   };

//   const handleLeaveSermon = () => {
//     fetch('http://127.0.0.1:2296/stop_stream', { method: 'POST' })
//       .then(() => {
//         setIsSermonActive(false);
//         if (transcriptionEventSourceRef.current) {
//           transcriptionEventSourceRef.current.close();
//           transcriptionEventSourceRef.current = null;
//         }
//         if (translationEventSourceRef.current) {
//           translationEventSourceRef.current.close();
//           translationEventSourceRef.current = null;
//         }
//         setCurrentTranscription('');
//         synth.cancel();
//         isSpeakingRef.current = false;
//         setSuccess('Left sermon successfully');
//         setTimeout(() => setSuccess(null), 2000);
//       })
//       .catch((error) => {
//         setError('Error leaving sermon: ' + error.message);
//         console.error(error);
//       });
//   };

//   const handleLanguageChange = (selectedOption) => {
//     setSelectedLanguage(selectedOption || languageOptions[0]);
//     console.log('Language changed to:', selectedOption?.label);

//     setError(null);
//     synth.cancel();
//     isSpeakingRef.current = false;

//     if (translationEventSourceRef.current) {
//       translationEventSourceRef.current.close();
//       translationEventSourceRef.current = null;
//     }

//     const targetLanguage = selectedOption?.value;
//     if (transcriptionEventSourceRef.current && targetLanguage !== 'en') {
//       connectTranslationStream(targetLanguage);
//     }
//   };

//   // Cleanup before component unmounts
//   useEffect(() => {
//     return () => {
//       if (transcriptionEventSourceRef.current) transcriptionEventSourceRef.current.close();
//       if (translationEventSourceRef.current) translationEventSourceRef.current.close();
//       synth.cancel();
//     };
//   }, []);

//   return (
//     <StyledBox>
//       <Typography
//         variant="h4"
//         align="center"
//         gutterBottom
//         sx={{ fontWeight: 'bold', color: '#231f20' }}
//       >
//         Available Live Sermons {isSermonActive ? '(Active)' : ''}
//       </Typography>

//       {error && (
//         <Paper
//           elevation={1}
//           style={{ backgroundColor: '#ffebee', padding: '1rem', marginBottom: '1rem' }}
//         >
//           <Typography color="error">{error}</Typography>
//         </Paper>
//       )}

//       {success && (
//         <Paper
//           elevation={1}
//           style={{ backgroundColor: '#e8f5e9', padding: '1rem', marginBottom: '1rem' }}
//         >
//           <Typography color="success">{success}</Typography>
//         </Paper>
//       )}

//       <CustomPaper elevation={3}>
//         <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//           Select Your Preferred Language
//         </Typography>

//         <FormControl fullWidth>
//           <Select
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//             options={languageOptions}
//             placeholder="Select a language"
//             styles={customStyles}
//             isClearable
//             defaultValue={languageOptions[0]}
//             isDisabled={isSermonActive}
//           />
//         </FormControl>

//         <Box mt={4} display="flex" justifyContent="center" gap={2}>
//           {!isSermonActive ? (
//             <StyledButton variant="contained" className="bg-b" onClick={handleJoinSermon}>
//               Join Live Sermon
//             </StyledButton>
//           ) : (
//             <StyledButton
//               variant="contained"
//               className="bg-b"
//               onClick={handleLeaveSermon}
//               style={{ backgroundColor: '#dc3545' }}
//             >
//               Leave Sermon
//             </StyledButton>
//           )}
//         </Box>
//       </CustomPaper>

//       {isSermonActive && (
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//             Live Transcription ({selectedLanguage.label}):
//           </Typography>
//           <Paper
//             elevation={2}
//             style={{
//               padding: '1rem',
//               backgroundColor: '#f8f9fa',
//               minHeight: '100px',
//               maxHeight: '300px',
//               overflowY: 'auto',
//               whiteSpace: 'pre-wrap',
//               wordBreak: 'break-word',
//             }}
//           >
//             <Typography variant="body1" style={{ color: '#231f20' }}>
//               {currentTranscription || 'Waiting for transcription...'}
//             </Typography>
//           </Paper>
//         </Box>
//       )}

//       {isSermonActive && (
//         <Box mt={2} display="flex" justifyContent="center">
//           <Typography variant="caption" color="textSecondary">
//             Listening for live transcription in {selectedLanguage.label}
//           </Typography>
//         </Box>
//       )}
//     </StyledBox>
//   );
// };

// export default JoinLiveSermon;












// import React, { useState, useEffect, useRef } from 'react';
// import Select from 'react-select';
// import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
// import { styled } from '@mui/system';

// const languageOptions = [
//   { value: 'en', label: 'English' },
//   { value: 'es', label: 'Spanish' },
//   { value: 'pt', label: 'Portuguese' },
// ];

// // Styled components
// const StyledBox = styled(Box)(({ theme }) => ({
//   width: '100%',
//   maxWidth: '1000px',
//   margin: 'auto',
//   padding: theme.spacing(4),
//   backgroundColor: '#ffffff',
//   borderRadius: '16px',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
// }));

// const CustomPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   backgroundColor: '#f9fafc',
//   width: '100%',
// }));

// const TranscriptionContainer = styled(Paper)(({ theme }) => ({
//   padding: '20px',
//   backgroundColor: '#f9f9f9',
//   border: '1px solid #ddd',
//   borderRadius: '5px',
//   height: '300px',
//   overflowY: 'auto',
//   fontSize: '18px',
//   lineHeight: 1.6,
//   whiteSpace: 'pre-wrap',
//   wordWrap: 'break-word',
// }));

// const JoinLiveSermon = () => {
//   const [currentTranscription, setCurrentTranscription] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
//   const [isSermonActive, setIsSermonActive] = useState(false);
//   const [error, setError] = useState(null);
//   const eventSourceRef = useRef(null);
//   const lastSpokenTextRef = useRef('');

//   // Configure voices for different languages
//   const getVoice = (lang) => {
//     const voices = window.speechSynthesis.getVoices();
//     switch (lang) {
//       case 'es':
//         return voices.find(voice => voice.lang.startsWith('es')) || 
//                voices.find(voice => voice.lang === 'es-ES') ||
//                voices.find(voice => voice.lang.includes('Spanish'));
//       case 'pt':
//         return voices.find(voice => voice.lang.startsWith('pt')) || 
//                voices.find(voice => voice.lang === 'pt-BR') ||
//                voices.find(voice => voice.lang.includes('Portuguese'));
//       default:
//         return voices.find(voice => voice.lang === 'en-US') ||
//                voices.find(voice => voice.lang.startsWith('en'));
//     }
//   };

//   const speakText = (text) => {
//     if (!text || text === lastSpokenTextRef.current) return;
    
//     lastSpokenTextRef.current = text;
//     const utterance = new SpeechSynthesisUtterance(text);
    
//     // Set language-specific properties
//     switch (selectedLanguage.value) {
//       case 'es':
//         utterance.lang = 'es-ES';
//         utterance.rate = 0.9;  // Slightly slower for Spanish
//         break;
//       case 'pt':
//         utterance.lang = 'pt-BR';
//         utterance.rate = 0.9;  // Slightly slower for Portuguese
//         break;
//       default:
//         utterance.lang = 'en-US';
//         utterance.rate = 1.0;
//     }
    
//     // Get appropriate voice for the language
//     const voice = getVoice(selectedLanguage.value);
//     if (voice) utterance.voice = voice;
    
//     window.speechSynthesis.speak(utterance);
//   };

//   const connectToStream = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//     }

//     eventSourceRef.current = new EventSource('http://127.0.0.1:4585/stream_transcription');
    
//     eventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive && data.transcription) {
//           const trimmedText = data.transcription.trim();
          
//           if (selectedLanguage.value === 'en') {
//             setCurrentTranscription(trimmedText);
//             if (data.is_final) speakText(trimmedText);
//           } else {
//             try {
//               const response = await fetch('http://127.0.0.1:4585/translate_realtime', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   text: trimmedText,
//                   targetLanguage: selectedLanguage.value,
//                   isFinal: data.is_final
//                 })
//               });

//               if (response.ok) {
//                 const translatedData = await response.json();
//                 setCurrentTranscription(translatedData.translation);
//                 if (data.is_final) speakText(translatedData.translation);
//               }
//             } catch (error) {
//               console.error('Translation error:', error);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Stream processing error:', error);
//       }
//     };

//     eventSourceRef.current.onerror = () => {
//       setError('Connection lost. Reconnecting...');
//       eventSourceRef.current.close();
//       setTimeout(connectToStream, 2000);
//     };
//   };

//   const handleJoinSermon = () => {
//     setIsSermonActive(true);
//     setCurrentTranscription('');
//     connectToStream();
//   };

//   const handleLeaveSermon = () => {
//     setIsSermonActive(false);
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//     setCurrentTranscription('');
//     window.speechSynthesis.cancel();
//   };

//   const handleLanguageChange = (selectedOption) => {
//     setSelectedLanguage(selectedOption);
//     window.speechSynthesis.cancel();
//     lastSpokenTextRef.current = '';
//   };

//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   return (
//     <StyledBox>
//       <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
//         Join Live Sermon {isSermonActive ? '(Active)' : ''}
//       </Typography>

//       {error && (
//         <Paper elevation={1} sx={{ backgroundColor: '#ffebee', padding: '1rem', marginBottom: '1rem' }}>
//           <Typography color="error">{error}</Typography>
//         </Paper>
//       )}

//       <CustomPaper elevation={3}>
//         <Typography variant="h6" gutterBottom sx={{ color: '#231f20' }}>
//           Select Your Preferred Language
//         </Typography>

//         <FormControl fullWidth>
//           <Select
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//             options={languageOptions}
//             isDisabled={isSermonActive}
//           />
//         </FormControl>

//         <Box mt={4} display="flex" justifyContent="center" gap={2}>
//           {!isSermonActive ? (
//             <Button 
//               variant="contained" 
//               color="primary" 
//               onClick={handleJoinSermon}
//             >
//               Join Live Sermon
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleLeaveSermon}
//             >
//               Leave Sermon
//             </Button>
//           )}
//         </Box>
//       </CustomPaper>

//       {isSermonActive && (
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom sx={{ color: '#231f20' }}>
//             Live Sermon ({selectedLanguage.label}):
//           </Typography>
//           <TranscriptionContainer>
//             <Typography variant="body1" sx={{ color: '#231f20' }}>
//               {currentTranscription || 'Waiting for broadcast...'}
//             </Typography>
//           </TranscriptionContainer>
//         </Box>
//       )}
//     </StyledBox>
//   );
// };

// export default JoinLiveSermon;


// Akhil code need only multiple languages
// import React, { useState, useEffect, useRef } from 'react';
// import Select from 'react-select';
// import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import '../../index.scss';

// const languageOptions = [
//   { value: 'en', label: 'English' },
//   { value: 'es', label: 'Spanish' },
//   { value: 'pt', label: 'Portuguese' },
// ];

// // Styled components...
// const StyledBox = styled(Box)(({ theme }) => ({
//   width: '100%',
//   maxWidth: '1000px',
//   margin: 'auto',
//   padding: theme.spacing(4),
//   backgroundColor: '#ffffff',
//   borderRadius: '16px',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
// }));

// const CustomPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   backgroundColor: '#f9fafc',
//   width: '100%',
// }));

// const TranscriptionContainer = styled(Paper)(({ theme }) => ({
//   padding: '20px',
//   backgroundColor: '#f9f9f9',
//   border: '1px solid #ddd',
//   borderRadius: '5px',
//   height: '300px',
//   overflowY: 'auto',
//   fontSize: '18px',
//   lineHeight: 1.6,
//   whiteSpace: 'pre-wrap',
//   wordWrap: 'break-word',
// }));

// const JoinLiveSermon = () => {
//   const [currentTranscription, setCurrentTranscription] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
//   const [isSermonActive, setIsSermonActive] = useState(false);
//   const [error, setError] = useState(null);
//   const eventSourceRef = useRef(null);
//   const synth = window.speechSynthesis;
//   const lastSpokenTextRef = useRef('');

//   const speakText = (text) => {
//     if (!text || text === lastSpokenTextRef.current) return;
    
//     lastSpokenTextRef.current = text;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = selectedLanguage.value === 'es' ? 'es-ES' : 
//                      selectedLanguage.value === 'pt' ? 'pt-BR' : 'en-US';
//     synth.speak(utterance);
//   };

//   const connectToStream = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//     }

//     eventSourceRef.current = new EventSource('http://127.0.0.1:4585/stream_transcription');
    
//     eventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive && data.transcription) {
//           const trimmedText = data.transcription.trim();
          
//           if (selectedLanguage.value === 'en') {
//             setCurrentTranscription(trimmedText);
//             if (data.is_final) {
//               speakText(trimmedText);
//             }
//           } else {
//             try {
//               const response = await fetch('http://127.0.0.1:4585/translate_realtime', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   text: trimmedText,
//                   targetLanguage: selectedLanguage.value,
//                   isFinal: data.is_final
//                 })
//               });

//               if (response.ok) {
//                 const translatedData = await response.json();
//                 setCurrentTranscription(translatedData.translation);
//                 if (data.is_final) {
//                   speakText(translatedData.translation);
//                 }
//               }
//             } catch (error) {
//               console.error('Translation error:', error);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Stream processing error:', error);
//       }
//     };

//     eventSourceRef.current.onerror = () => {
//       setError('Connection lost. Reconnecting...');
//       eventSourceRef.current.close();
//       setTimeout(connectToStream, 2000);
//     };
//   };

//   const handleJoinSermon = async () => {
//     try {
//       setIsSermonActive(true);
//       setCurrentTranscription('');
//       connectToStream();
//     } catch (error) {
//       setError('Error joining sermon: ' + error.message);
//     }
//   };

//   const handleLeaveSermon = () => {
//     setIsSermonActive(false);
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//     setCurrentTranscription('');
//     synth.cancel();
//   };

//   const handleLanguageChange = (selectedOption) => {
//     setSelectedLanguage(selectedOption);
//     synth.cancel();
//     lastSpokenTextRef.current = '';
//   };

//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
//       synth.cancel();
//     };
//   }, []);

//   return (
//     <StyledBox>
//       <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
//         Join Live Sermon {isSermonActive ? '(Active)' : ''}
//       </Typography>

//       {error && (
//         <Paper elevation={1} style={{ backgroundColor: '#ffebee', padding: '1rem', marginBottom: '1rem' }}>
//           <Typography color="error">{error}</Typography>
//         </Paper>
//       )}

//       <CustomPaper elevation={3}>
//         <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//           Select Your Preferred Language
//         </Typography>

//         <FormControl fullWidth>
//           <Select
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//             options={languageOptions}
//             isDisabled={isSermonActive}
//           />
//         </FormControl>

//         <Box mt={4} display="flex" justifyContent="center" gap={2}>
//           {!isSermonActive ? (
//             <Button variant="contained" color="primary" onClick={handleJoinSermon}>
//               Join Live Sermon
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleLeaveSermon}
//             >
//               Leave Sermon
//             </Button>
//           )}
//         </Box>
//       </CustomPaper>

//       {isSermonActive && (
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//             Live Sermon ({selectedLanguage.label}):
//           </Typography>
//           <TranscriptionContainer>
//             <Typography variant="body1" style={{ color: '#231f20' }}>
//               {currentTranscription || 'Waiting for broadcast...'}
//             </Typography>
//           </TranscriptionContainer>
//         </Box>
//       )}
//     </StyledBox>
//   );
// };

// export default JoinLiveSermon;







//Rahul code
// import React, { useState, useEffect, useContext, useRef } from 'react';
// import Select from 'react-select';
// import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import '../../index.scss';
// import { UserContext } from '../../contexts/UserContext';

// const languageOptions = [
//   { value: 'en', label: 'English' },
//   { value: 'es', label: 'Spanish' },
//   { value: 'pt', label: 'Portuguese' },
// ];

// // Existing styled components remain the same
// const CustomPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   backgroundColor: '#f9fafc',
//   width: '100%',
// }));

// const StyledBox = styled(Box)(({ theme }) => ({
//   width: '100%',
//   maxWidth: '1000px',
//   margin: 'auto',
//   padding: theme.spacing(4),
//   backgroundColor: '#ffffff',
//   borderRadius: '16px',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   padding: '10px 20px',
//   fontSize: '16px',
//   borderRadius: '8px',
//   textTransform: 'none',
//   boxShadow: '0px 4px 10px #231f20',
//   '&.bg-b': {
//     backgroundColor: '#231f20',
//     '&:hover': {
//       backgroundColor: '#3d3d3d',
//     },
//   },
// }));

// const TranscriptionContainer = styled(Paper)(({ theme }) => ({
//   padding: '20px',
//   backgroundColor: '#f9f9f9',
//   border: '1px solid #ddd',
//   borderRadius: '5px',
//   height: '300px',
//   overflowY: 'auto',
//   fontSize: '18px',
//   lineHeight: 1.6,
//   whiteSpace: 'pre-wrap',
//   wordWrap: 'break-word',
// }));

// const VoiceInfo = styled(Typography)(({ theme }) => ({
//   textAlign: 'center',
//   margin: '10px 0',
//   color: '#666',
//   fontSize: '14px',
// }));

// const JoinLiveSermon = () => {
//   const { user } = useContext(UserContext);
//   const [currentTranscription, setCurrentTranscription] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
//   const [isSermonActive, setIsSermonActive] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [voiceInfo, setVoiceInfo] = useState('');
//   const transcriptionEventSourceRef = useRef(null);
//   const translationEventSourceRef = useRef(null);
//   const clientId = useRef(generateUUID()).current;
//   const synth = window.speechSynthesis;
//   const currentAudioRef = useRef(null);
//   const lastSpokenTextRef = useRef('');
//   const isSpeakingRef = useRef(false);

//   function generateUUID() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//       const r = Math.random() * 16 | 0,
//           v = c === 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//     });
//   }

//   const stopAllSpeech = async () => {
//     if (currentAudioRef.current) {
//       currentAudioRef.current.pause();
//       currentAudioRef.current.currentTime = 0;
//       currentAudioRef.current = null;
//     }
//     synth.cancel();
//     isSpeakingRef.current = false;
//   };

//   const updateVoiceInfo = (language) => {
//     if (language === 'pt') {
//       setVoiceInfo('Using Microsoft Azure pt-BR-AntonioNeural voice');
//     } else if (language === 'es') {
//       setVoiceInfo('Using Microsoft Azure es-ES-AlvaroNeural voice');
//     } else {
//       setVoiceInfo('Using system default voice');
//     }
//   };

//   const speakText = async (text) => {
//     if (!text.trim() || text === lastSpokenTextRef.current || isSpeakingRef.current) return;
//     lastSpokenTextRef.current = text;

//     try {
//       await stopAllSpeech();
//       isSpeakingRef.current = true;

//       const language = selectedLanguage.value;
      
//       if (language === 'pt' || language === 'es') {
//         const response = await fetch('http://127.0.0.1:4585/synthesize_speech', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             text: text,
//             language: language
//           })
//         });

//         if (!response.ok) {
//           throw new Error('Speech synthesis failed');
//         }

//         const audioBlob = await response.blob();
//         const audioUrl = URL.createObjectURL(audioBlob);

//         return new Promise((resolve, reject) => {
//           const audio = new Audio(audioUrl);
//           currentAudioRef.current = audio;

//           const cleanupAudio = () => {
//             URL.revokeObjectURL(audioUrl);
//             currentAudioRef.current = null;
//             isSpeakingRef.current = false;
//           };

//           audio.onended = () => {
//             cleanupAudio();
//             resolve();
//           };

//           audio.onerror = (error) => {
//             cleanupAudio();
//             reject(error);
//           };

//           audio.play().catch(error => {
//             cleanupAudio();
//             reject(error);
//           });
//         });
//       } else {
//         return new Promise((resolve, reject) => {
//           const utterance = new SpeechSynthesisUtterance(text);
//           utterance.lang = language;
          
//           utterance.onend = () => {
//             isSpeakingRef.current = false;
//             resolve();
//           };
          
//           utterance.onerror = (event) => {
//             isSpeakingRef.current = false;
//             reject(event);
//           };
          
//           synth.speak(utterance);
//         });
//       }
//     } catch (error) {
//       console.error('Speech error:', error);
//       isSpeakingRef.current = false;
//       setError(`Error during speech synthesis: ${error.message}`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const connectEventSource = () => {
//     if (transcriptionEventSourceRef.current) {
//       transcriptionEventSourceRef.current.close();
//     }

//     transcriptionEventSourceRef.current = new EventSource('http://127.0.0.1:4585/stream_transcription');
//     let lastTranscription = '';

//     transcriptionEventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive && data.transcription) {
//           const targetLanguage = selectedLanguage.value;
//           const trimmedText = data.transcription.trim();
//           const isFinal = data.is_final;

//           if (targetLanguage === 'en') {
//             if (trimmedText !== lastTranscription) {
//               setCurrentTranscription(trimmedText);
//               if (isFinal && trimmedText) {
//                 lastTranscription = trimmedText;
//                 await speakText(trimmedText);
//               }
//             }
//           } else {
//             try {
//               const response = await fetch('http://127.0.0.1:4585/translate_realtime', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   text: trimmedText,
//                   targetLanguage: targetLanguage,
//                   clientId: clientId,
//                   isFinal: isFinal
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Translation request failed');
//               }
//             } catch (error) {
//               console.error('Translation error:', error);
//               setError('Error processing translation');
//               setTimeout(() => setError(null), 2000);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Transcription processing error:', error);
//       }
//     };

//     transcriptionEventSourceRef.current.onerror = () => {
//       setError('Connection lost. Reconnecting...');
//       transcriptionEventSourceRef.current.close();
//       setTimeout(connectEventSource, 2000);
//     };
//   };

//   const connectTranslationStream = (targetLanguage) => {
//     if (translationEventSourceRef.current) {
//       translationEventSourceRef.current.close();
//     }

//     translationEventSourceRef.current = new EventSource(`http://127.0.0.1:4585/stream_translation/${targetLanguage}?client_id=${clientId}`);
//     let lastTranslation = '';

//     translationEventSourceRef.current.onmessage = async (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (!data.keepalive) {
//           if (data.type === 'partial') {
//             setCurrentTranscription(data.translation);
//           } else if (data.type === 'final' && data.translation) {
//             if (data.translation !== lastTranslation) {
//               setCurrentTranscription(data.translation);
//               lastTranslation = data.translation;
//               await speakText(data.translation);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Translation processing error:', error);
//       }
//     };

//     translationEventSourceRef.current.onerror = () => {
//       setError('Translation connection lost. Reconnecting...');
//       translationEventSourceRef.current.close();
//       setTimeout(() => connectTranslationStream(targetLanguage), 2000);
//     };
//   };

//   const handleJoinSermon = () => {
//     setError(null);
//     stopAllSpeech();
//     lastSpokenTextRef.current = '';

//     fetch('http://127.0.0.1:4585/start_stream', { method: 'POST' })
//       .then(response => {
//         if (!response.ok) throw new Error('Failed to start stream');
//         setIsSermonActive(true);
//         setCurrentTranscription('');

//         connectEventSource();

//         const targetLanguage = selectedLanguage.value;
//         if (targetLanguage !== 'en') {
//           connectTranslationStream(targetLanguage);
//         }
//       })
//       .catch(error => {
//         setError('Error starting stream: ' + error.message);
//         console.error(error);
//       });
//   };

//   const handleLeaveSermon = () => {
//     fetch('http://127.0.0.1:4585/stop_stream', { method: 'POST' })
//       .then(() => {
//         setIsSermonActive(false);
//         if (transcriptionEventSourceRef.current) {
//           transcriptionEventSourceRef.current.close();
//           transcriptionEventSourceRef.current = null;
//         }
//         if (translationEventSourceRef.current) {
//           translationEventSourceRef.current.close();
//           translationEventSourceRef.current = null;
//         }
//         setCurrentTranscription('');
//         stopAllSpeech();
//         lastSpokenTextRef.current = '';
//       })
//       .catch(error => {
//         setError('Error stopping stream: ' + error.message);
//         console.error(error);
//       });
//   };

//   const handleLanguageChange = (selectedOption) => {
//     setSelectedLanguage(selectedOption);
//     setCurrentTranscription('');
//     setError(null);
//     stopAllSpeech();
//     lastSpokenTextRef.current = '';
//     updateVoiceInfo(selectedOption.value);

//     if (translationEventSourceRef.current) {
//       translationEventSourceRef.current.close();
//       translationEventSourceRef.current = null;
//     }

//     if (isSermonActive && selectedOption.value !== 'en') {
//       setTimeout(() => connectTranslationStream(selectedOption.value), 100);
//     }
//   };

//   useEffect(() => {
//     updateVoiceInfo(selectedLanguage.value);
    
//     return () => {
//       if (transcriptionEventSourceRef.current) transcriptionEventSourceRef.current.close();
//       if (translationEventSourceRef.current) translationEventSourceRef.current.close();
//       stopAllSpeech();
//     };
//   }, []);

//   return (
//     <StyledBox>
//       <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
//         Join Live Sermon {isSermonActive ? '(Active)' : ''}
//       </Typography>

//       {error && (
//         <Paper elevation={1} style={{ backgroundColor: '#ffebee', padding: '1rem', marginBottom: '1rem' }}>
//           <Typography color="error">{error}</Typography>
//         </Paper>
//       )}

//       {success && (
//         <Paper elevation={1} style={{ backgroundColor: '#e8f5e9', padding: '1rem', marginBottom: '1rem' }}>
//           <Typography color="success">{success}</Typography>
//         </Paper>
//       )}

//       <CustomPaper elevation={3}>
//         <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//           Select Your Preferred Language
//         </Typography>

//         <FormControl fullWidth>
//           <Select
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//             options={languageOptions}
//             isDisabled={isSermonActive}
//           />
//         </FormControl>

//         <VoiceInfo>{voiceInfo}</VoiceInfo>

//         <Box mt={4} display="flex" justifyContent="center" gap={2}>
//           {!isSermonActive ? (
//             <StyledButton variant="contained" className="bg-b" onClick={handleJoinSermon}>
//               Join Live Sermon
//             </StyledButton>
//           ) : (
//             <StyledButton
//               variant="contained"
//               className="bg-b"
//               onClick={handleLeaveSermon}
//               style={{ backgroundColor: '#dc3545' }}
//             >
//               Leave Sermon
//             </StyledButton>
//           )}
//         </Box>
//       </CustomPaper>

//       {isSermonActive && (
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom style={{ color: '#231f20' }}>
//             Live Transcription ({selectedLanguage.label}):
//           </Typography>
//           <TranscriptionContainer>
//             <Typography variant="body1" style={{ color: '#231f20' }}>
//               {currentTranscription || 'Waiting for transcription...'}
//             </Typography>
//           </TranscriptionContainer>
//         </Box>
//       )}
//     </StyledBox>
//   );
// };

// export default JoinLiveSermon;


//Latest code ''
import React, { useState, useEffect, useContext, useRef } from 'react';
import Select from 'react-select';
import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import '../../index.scss';
import { UserContext } from '../../contexts/UserContext';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
];

// All styled components remain exactly the same
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
    },
  },
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
  wordWrap: 'break-word',
}));

const VoiceInfo = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  margin: '10px 0',
  color: '#666',
  fontSize: '14px',
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

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const stopAllSpeech = async () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    synth.cancel();
    isSpeakingRef.current = false;
  };

  const updateVoiceInfo = (language) => {
    if (language === 'pt') {
      setVoiceInfo('Using Microsoft Azure pt-BR-AntonioNeural voice');
    } else if (language === 'es') {
      setVoiceInfo('Using Microsoft Azure es-ES-AlvaroNeural voice');
    } else {
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
      
      if (language === 'pt' || language === 'es') {
        const response = await fetch('http://127.0.0.1:4585/synthesize_speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

        return new Promise((resolve, reject) => {
          const audio = new Audio(audioUrl);
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

          audio.play().catch(error => {
            cleanupAudio();
            reject(error);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          
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

    transcriptionEventSourceRef.current = new EventSource('http://127.0.0.1:4585/stream_transcription');
    let lastTranscription = '';

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
              const response = await fetch('http://127.0.0.1:4585/translate_realtime', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
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
    if (translationEventSourceRef.current) {
      translationEventSourceRef.current.close();
    }

    translationEventSourceRef.current = new EventSource(`http://127.0.0.1:4585/stream_translation/${targetLanguage}?client_id=${clientId}`);
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
      setError('Translation connection lost. Reconnecting...');
      translationEventSourceRef.current.close();
      setTimeout(() => connectTranslationStream(targetLanguage), 2000);
    };
  };

  const handleJoinSermon = () => {
    setError(null);
    setIsSermonActive(true);
    setCurrentTranscription('');
    
    connectEventSource();
    if (selectedLanguage.value !== 'en') {
      connectTranslationStream(selectedLanguage.value);
    }
  };

  const handleLeaveSermon = () => {
    fetch('http://127.0.0.1:4585/stop_stream', { method: 'POST' })
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
      .catch(error => {
        setError('Error stopping stream: ' + error.message);
        console.error(error);
      });
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    setCurrentTranscription('');
    setError(null);
    stopAllSpeech();
    lastSpokenTextRef.current = '';
    updateVoiceInfo(selectedOption.value);

    if (translationEventSourceRef.current) {
      translationEventSourceRef.current.close();
      translationEventSourceRef.current = null;
    }

    if (isSermonActive && selectedOption.value !== 'en') {
      setTimeout(() => connectTranslationStream(selectedOption.value), 100);
    }
  };

  useEffect(() => {
    updateVoiceInfo(selectedLanguage.value);
    
    return () => {
      if (transcriptionEventSourceRef.current) transcriptionEventSourceRef.current.close();
      if (translationEventSourceRef.current) translationEventSourceRef.current.close();
      stopAllSpeech();
    };
  }, []);

  return (
    <StyledBox>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#231f20' }}>
        Join Live Sermon {isSermonActive ? '(Active)' : ''}
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
            isDisabled={isSermonActive}
          />
        </FormControl>

        <VoiceInfo>{voiceInfo}</VoiceInfo>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {!isSermonActive ? (
            <StyledButton variant="contained" className="bg-b" onClick={handleJoinSermon}>
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
          <TranscriptionContainer>
            <Typography variant="body1" style={{ color: '#231f20' }}>
              {currentTranscription || 'Waiting for transcription...'}
            </Typography>
          </TranscriptionContainer>
        </Box>
      )}
    </StyledBox>
  );
};

export default JoinLiveSermon;
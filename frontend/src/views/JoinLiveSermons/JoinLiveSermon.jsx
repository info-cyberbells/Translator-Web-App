<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9d8938c (latest code pushed to git)
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Typography, Box, FormControl, Select, CircularProgress, TableBody, MenuItem, Paper, TableContainer, Button, Table, TableHead, TableRow, TableCell, Container, Alert, styled, Card, CardContent, CardActions, Grid, Divider, Pagination } from '@mui/material';
import SEO from 'views/Seo/SeoMeta';
import axios from 'axios';
<<<<<<< HEAD


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LANGUAGE_OPTIONS = [
=======
// import React, { useState, useEffect, useContext, useRef } from 'react';
// import Select from 'react-select';
// import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import '../../index.scss';
// import { UserContext } from '../../contexts/UserContext';
=======
>>>>>>> 9d8938c (latest code pushed to git)


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

<<<<<<< HEAD
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

//     eventSourceRef.current = new EventSource('http://52.189.226.39:4585/stream_transcription');

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
//               const response = await fetch('http://52.189.226.39:4585/translate_realtime', {
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

//     eventSourceRef.current = new EventSource('http://52.189.226.39:4585/stream_transcription');

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
//               const response = await fetch('http://52.189.226.39:4585/translate_realtime', {
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
//         const response = await fetch('http://52.189.226.39:4585/synthesize_speech', {
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

//     transcriptionEventSourceRef.current = new EventSource('http://52.189.226.39:4585/stream_transcription');
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
//               const response = await fetch('http://52.189.226.39:4585/translate_realtime', {
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

//     translationEventSourceRef.current = new EventSource(`http://52.189.226.39:4585/stream_translation/${targetLanguage}?client_id=${clientId}`);
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

//     fetch('http://52.189.226.39:4585/start_stream', { method: 'POST' })
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
//     fetch('http://52.189.226.39:4585/stop_stream', { method: 'POST' })
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

// //Latest code ''
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

// // All styled components
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
//         const response = await fetch('http://52.189.226.39:4585/synthesize_speech', {
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

//     transcriptionEventSourceRef.current = new EventSource('http://52.189.226.39:4585/stream_transcription');
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
//               const response = await fetch('http://52.189.226.39:4585/translate_realtime', {
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

//     translationEventSourceRef.current = new EventSource(`http://52.189.226.39:4585/stream_translation/${targetLanguage}?client_id=${clientId}`);
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
//     setIsSermonActive(true);
//     setCurrentTranscription('');

//     connectEventSource();
//     if (selectedLanguage.value !== 'en') {
//       connectTranslationStream(selectedLanguage.value);
//     }
//   };

//   const handleLeaveSermon = () => {
//     fetch('http://52.189.226.39:4585/stop_stream', { method: 'POST' })
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

//   const handleLanguageChange = async (selectedOption) => {
//     setSelectedLanguage(selectedOption);
//     setCurrentTranscription('');
//     setError(null);
//     await stopAllSpeech();
//     lastSpokenTextRef.current = '';
//     updateVoiceInfo(selectedOption.value);

//     // Close existing translation stream if any
//     if (translationEventSourceRef.current) {
//       translationEventSourceRef.current.close();
//       translationEventSourceRef.current = null;
//     }

//     // If sermon is active, immediately connect to new translation stream
//     if (isSermonActive) {
//       if (selectedOption.value === 'en') {
//         // For English, we just need the transcription stream
//         if (transcriptionEventSourceRef.current) {
//           transcriptionEventSourceRef.current.close();
//         }
//         connectEventSource();
//       } else {
//         // For other languages, connect to both transcription and translation streams
//         if (!transcriptionEventSourceRef.current) {
//           connectEventSource();
//         }
//         // Short delay to ensure proper stream initialization
//         setTimeout(() => connectTranslationStream(selectedOption.value), 100);
//       }

//       // Show a success message for language change
//       setSuccess(`Switched to ${selectedOption.label} successfully`);
//       setTimeout(() => setSuccess(null), 2000);
//     }
//   };

//   useEffect(() => {
//     console.log('useEffect running - initializing voice info for language:', selectedLanguage.value);
//     updateVoiceInfo(selectedLanguage.value);

//     return () => {
//       console.log('Cleanup function running - closing streams');

//       if (transcriptionEventSourceRef.current) {
//         console.log('Closing transcription stream');
//         transcriptionEventSourceRef.current.close();
//       }

//       if (translationEventSourceRef.current) {
//         console.log('Closing translation stream');
//         translationEventSourceRef.current.close();
//       }

//       console.log('Stopping all speech');
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

// ===================================================================
// New code working with double click

import React, { useState, useEffect, useContext, useRef } from 'react';
import Select from 'react-select';
import { Typography, Box, FormControl, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import '../../index.scss';
import { UserContext } from '../../contexts/UserContext';

const languageOptions = [
>>>>>>> c307fdc (New changes)
=======
const LANGUAGE_OPTIONS = [
>>>>>>> 9d8938c (latest code pushed to git)
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'id', label: 'Indonesian' },
  { value: 'zh', label: 'Mandarin' },
  { value: 'ar', label: 'Arabic' }
];

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9d8938c (latest code pushed to git)
// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
<<<<<<< HEAD
  padding: theme.spacing(4),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: '#f9fafc'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  marginBottom: theme.spacing(3),
  overflow: 'visible'
}));

const LiveIndicator = styled('div')({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: '#e63946',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '12px',
  marginLeft: '10px'
});

const ControlsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px'
  }
=======
// All styled components
const CustomPaper = styled(Paper)(({ theme }) => ({
=======
>>>>>>> 9d8938c (latest code pushed to git)
  padding: theme.spacing(4),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: '#f9fafc'
}));

<<<<<<< HEAD
const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
>>>>>>> c307fdc (New changes)
=======
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  marginBottom: theme.spacing(3),
  overflow: 'visible'
}));

const LiveIndicator = styled('div')({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: '#e63946',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '12px',
  marginLeft: '10px'
});

const ControlsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px'
  }
>>>>>>> 9d8938c (latest code pushed to git)
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a1a1a', // Dark black color
  color: '#ffffff',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  minWidth: 160,
  '&:hover': {
    backgroundColor: '#333333'
  },
  '&.MuiButton-containedError': {
    backgroundColor: '#1a1a1a',
    '&:hover': {
<<<<<<< HEAD
<<<<<<< HEAD
      backgroundColor: '#333333'
=======
      backgroundColor: '#3d3d3d'
>>>>>>> c307fdc (New changes)
=======
      backgroundColor: '#333333'
>>>>>>> 9d8938c (latest code pushed to git)
    }
  }
}));

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9d8938c (latest code pushed to git)
const TranscriptionBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  minHeight: '300px',
  maxHeight: '500px',
<<<<<<< HEAD
  overflowY: 'auto',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '16px',
  lineHeight: 1.6
}));

const StatusText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  color: theme.palette.text.secondary
}));

class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.currentSource = null;
    this.audioQueue = [];
    this.isProcessing = false;
    this.lastPlaybackFinishTime = 0;
    this.minimumGapBetweenPlaybacks = 50;
  }

  async playAudio(audioData) {
    if (this.audioQueue.length > 1) {
      console.log(`[PLAY] Clearing queue of size ${this.audioQueue.length}`);
      this.audioQueue = [];
    }

    this.audioQueue.push(audioData);

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.audioQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.audioQueue.length > 0) {
        const audioData = this.audioQueue.shift();
        await this._playAudioInternal(audioData);

        const now = performance.now();
        const timeSinceLastPlayback = now - this.lastPlaybackFinishTime;
        if (timeSinceLastPlayback < this.minimumGapBetweenPlaybacks) {
          await new Promise((resolve) => setTimeout(resolve, this.minimumGapBetweenPlaybacks - timeSinceLastPlayback));
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async _playAudioInternal(audioData) {
    const playStart = performance.now();
    console.log(`[PLAY] Starting audio playback setup`);

    try {
      if (this.currentSource) {
        console.log(`[PLAY] Stopping previous audio`);
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) {
          console.log(`[PLAY] Error cleaning up previous audio:`, e);
        }
        this.currentSource = null;
      }

      if (this.audioContext.state === 'suspended') {
        console.log(`[PLAY] Resuming AudioContext`);
        await this.audioContext.resume();
      }

      const arrayBuffer = await audioData.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const source = this.audioContext.createBufferSource();
      this.currentSource = source;
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      console.log(`[PLAY] Starting playback`);
      source.start(0);

      await new Promise((resolve) => {
        source.onended = () => {
          const totalTime = performance.now() - playStart;
          console.log(`[PLAY] Playback finished in ${totalTime}ms`);
          this.lastPlaybackFinishTime = performance.now();
          if (this.currentSource === source) {
            this.currentSource = null;
          }
          resolve();
        };
      });
    } catch (error) {
      console.error(`[ERROR] Audio playback error:`, error);
      this.currentSource = null;
      throw error;
    }
  }
}

const JoinLiveSermons = () => {
  const [status, setStatus] = useState('Ready to start');
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLiveSermonAvailable, setIsLiveSermonAvailable] = useState(false);
  const [previousSessionsPage, setPreviousSessionsPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Consistent with your other components

  // New states for sermon selection screen
  const [sermonData, setSermonData] = useState([]);
  const [liveSermon, setLiveSermon] = useState(null);
  const [showTranslationView, setShowTranslationView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [endedSessionsData, setEndedSessionsData] = useState([]);
  const [userPreviousSession, setUserPreviousSession] = useState(null);
  const [isAdminNameLoading, setIsAdminNameLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stableAdminInfo, setStableAdminInfo] = useState({
    name: '',
    isLoaded: false
  });


  const clientIdRef = useRef(generateUUID());
  const audioManagerRef = useRef(null);
  const eventSourceRef = useRef(null);
  const checkSermonIntervalRef = useRef(null);
  const checkSermonRef = useRef(null);
  const backendSessionIdRef = useRef(null);
  const adminUserRef = useRef(null);



  const getPaginatedSessions = () => {
    if (!userPreviousSession) return [];
    const startIndex = (previousSessionsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return userPreviousSession.slice(startIndex, endIndex);
  };

  // Handle page change for previous sessions
  const handlePreviousSessionsPageChange = (event, value) => {
    setPreviousSessionsPage(value);
  };


  // Calculate total pages for previous sessions
  const totalPreviousSessionPages = Math.ceil((userPreviousSession?.length || 0) / ITEMS_PER_PAGE);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const fetchLiveSermonData = useCallback(async () => {
    try {
      // Only set loading to true if we haven't loaded the admin name yet
      if (!stableAdminInfo.isLoaded) {
        setIsAdminNameLoading(true);
      }
  
      const response = await axios.get(`${apiBaseUrl}/sermon/checksermon`);
      console.log("Check Sermon API Response:", response.data);
  
      if (response.status !== 200) {
        throw new Error('Failed to fetch live sermons');
      }
  
      // Check if response.data is an empty array
      if (Array.isArray(response.data) && response.data.length === 0) {
        // If we're in translation view, reset the session
        if (showTranslationView) {
          // Reset session-related state
          setIsStreaming(false);
          setStatus('Disconnected');
          setShowTranslationView(false); // Return to sermon selection screen
          setTranscription('');
          setLiveSermon(null);
          setIsLiveSermonAvailable(false);
          backendSessionIdRef.current = null;
          setError('');
          setStableAdminInfo({
            name: '',
            isLoaded: false
          });
        }
        setIsLoading(false);
        setIsAdminNameLoading(false);
        return; // Exit early since we have no data to process
      }
  
      // Filter only live sermons
      const liveSermonData = response.data.find(sermon => sermon.status === 'Live');
  
      // If we have live sermon data and it has an adminStaffUserId
      // AND we haven't already loaded the admin info
      if (liveSermonData && liveSermonData.adminStaffUserId && !stableAdminInfo.isLoaded) {
        try {
          // Fetch admin user info only if we haven't loaded it yet
          const usersResponse = await axios.get(`${apiBaseUrl}/fetchAll`);
          const matchedUser = usersResponse.data.find(user => user._id === liveSermonData.adminStaffUserId);
  
          if (matchedUser) {
            // Add admin info directly to the liveSermonData object
            liveSermonData.adminStaff = {
              firstName: matchedUser.firstName,
              lastName: matchedUser.lastName
            };
  
            // Update the stable admin info
            setStableAdminInfo({
              name: `${matchedUser.firstName} ${matchedUser.lastName}`,
              isLoaded: true
            });
  
            setAdminUser(matchedUser);
          }
        } catch (adminError) {
          console.error('Error fetching admin data:', adminError);
        }
      }
  
      setLiveSermon(liveSermonData || null);
      setIsLiveSermonAvailable(!!liveSermonData);
      setIsLoading(false);
      setIsAdminNameLoading(false);
    } catch (error) {
      console.error('Error fetching live sermon data:', error);
      setIsLiveSermonAvailable(false);
      setIsLoading(false);
      setIsAdminNameLoading(false);
    }
  }, [stableAdminInfo.isLoaded, apiBaseUrl, showTranslationView]);

  
  useEffect(() => {
    fetchLiveSermonData();
    checkSermonIntervalRef.current = setInterval(fetchLiveSermonData, 3000);

    return () => {
      if (checkSermonIntervalRef.current) {
        clearInterval(checkSermonIntervalRef.current);
      }
      if (isStreaming && backendSessionIdRef.current) {
        stopBackendSession().catch(console.error);
      }
    };
  }, [fetchLiveSermonData, isStreaming]);

  
  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);


  // New function to start backend session
  const startBackendSession = async () => {
    try {
      if (!liveSermon) {
        console.warn("No live sermon found.");
        setError('No live sermon available.');
        return null;
      }

      const churchId = localStorage.getItem('churchId') || '66fbaf5bb02a5ffd85ca32f5';
      const userId = localStorage.getItem('userId');

      // Get current time in Indian timezone
      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach(part => {
          partsObj[part.type] = part.value;
        });

        // Format as ISO-like string: YYYY-MM-DDTHH:MM:SS+05:30
        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;

        return isoLike;
      };

      // Get the Indian time
      const indianTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/listen/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchId,
          sermonId: liveSermon._id,
          userId,
          startDateTime: indianTime, // Sending Indian time
          status: 'Live'
        })
      });

      if (!response.ok) throw new Error('Failed to create backend session');
      const data = await response.json();
      backendSessionIdRef.current = data._id;
      console.log('Backend session started:', data._id);
      return data;
    } catch (error) {
      console.error('Error in fetching live sermon or starting session:', error);
      setError('Failed to start backend session');
      return null;
    }
  };


  const stopBackendSession = async () => {
    if (!backendSessionIdRef.current) return;

    try {
      // Get current time in Indian timezone (same function used in startBackendSession)
      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach(part => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;

        return isoLike;
      };

      // Get the Indian time (same format as startBackendSession)
      const indianTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/listen/${backendSessionIdRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endDateTime: indianTime,
          status: 'End'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update backend session');
      }

      console.log('Backend session stopped');
      backendSessionIdRef.current = null;
    } catch (error) {
      console.error('Backend session stop error:', error);
    }
  };


  const fetchAndCompareData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/sermon/fetchAll`);
      console.log("Sermon API Response:", response.data);
      const adminStaffUserId = response.data.length > 0 ? response.data[0].adminStaffUserId : null;

      if (!adminStaffUserId) {
        console.warn("No adminStaffId found in sermons");
        return;
      }

      const usersResponse = await axios.get(`${apiBaseUrl}/fetchAll`);
      console.log("All Users API Response:", usersResponse.data);

      const matchedUser = usersResponse.data.find(user => user._id === adminStaffUserId);
      if (matchedUser) {
        // Compare with ref value to avoid unnecessary state updates
        if (!adminUserRef.current ||
          matchedUser._id !== adminUserRef.current._id ||
          matchedUser.firstName !== adminUserRef.current.firstName ||
          matchedUser.lastName !== adminUserRef.current.lastName) {

          adminUserRef.current = matchedUser;
          setAdminUser(matchedUser);
          console.log(`Admin Staff Name: ${matchedUser.firstName} ${matchedUser.lastName}`);
        }
      } else {
        console.warn("No matching user found for adminStaffId:", adminStaffUserId);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Set up the admin user data fetching
  useEffect(() => {
    fetchAndCompareData();
    checkSermonRef.current = setInterval(fetchAndCompareData, 3000);

    return () => {
      if (checkSermonRef.current) {
        clearInterval(checkSermonRef.current);
      }
    };
  }, [fetchAndCompareData]);

  const fetchEndedSessions = useCallback(async () => {
    try {
      const endedSessionsResponse = await axios.get(`${apiBaseUrl}/listen/getallusers`);
      console.log("Ended Sessions API Response:", endedSessionsResponse.data);
      setEndedSessionsData(endedSessionsResponse.data);

      // Get current user ID from localStorage
      const currentUserId = localStorage.getItem('userId');

      if (currentUserId && endedSessionsResponse.data.length > 0) {
        const userSessions = [];

        // Loop through all sermons
        for (const sermon of endedSessionsResponse.data) {
          // Check if this user exists in any sermon's listeners array
          const sessions = sermon.listeners.filter(
            listener => listener.userId === currentUserId
          );

          if (sessions.length > 0) {
            // Add all sessions for this user
            userSessions.push(...sessions.map(session => ({
              ...session,
              sermonId: sermon.sermonId,
              adminName: sermon.adminName,
              churchName: sermon.churchName,
              seniorPastor: sermon.seniorPastor
            })));
          }
        }

        // Set all previous sessions
        setUserPreviousSession(userSessions);
      }
    } catch (error) {
      console.error("Error fetching ended sessions:", error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!showTranslationView) {
      fetchEndedSessions();
    }
  }, [fetchEndedSessions, showTranslationView]);

  // Fetch sermon data on component mount - memoized to prevent unnecessary re-renders
  const fetchSermonData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/sermon/fetchAll`);
      console.log("Sermon API Response:", response.data);

      if (response.status !== 200) {
        throw new Error('Failed to fetch sermons');
      }

      // Check if there's any actual change before updating state
      const liveSermonFound = response.data.find(sermon => sermon.status === 'Live');
      const hasSermonDataChanged = !sermonData.length ||
        JSON.stringify(sermonData) !== JSON.stringify(response.data);
      const hasLiveSermonChanged = !liveSermon ||
        !liveSermonFound ||
        liveSermon._id !== liveSermonFound._id;

      // Only update state if there are actual changes
      if (hasSermonDataChanged) {
        setSermonData(response.data);
      }

      if (hasLiveSermonChanged) {
        setLiveSermon(liveSermonFound);
        setIsLiveSermonAvailable(!!liveSermonFound);
      }

      // Set loading to false only once
      if (isLoading) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching sermon data:', error);
      if (isLoading) {
        setError('Failed to fetch sermon data');
        setIsLiveSermonAvailable(false);
        setIsLoading(false);
      }
    }
  }, [sermonData, liveSermon, isLoading]);

  useEffect(() => {
    fetchLiveSermonData();
    checkSermonIntervalRef.current = setInterval(fetchLiveSermonData, 300000);

    return () => {
      if (checkSermonIntervalRef.current) {
        clearInterval(checkSermonIntervalRef.current);
      }
      // Remove this condition
      // if (isStreaming && backendSessionIdRef.current) {
      //   stopBackendSession().catch(console.error);
      // }
    };
  }, [fetchLiveSermonData]); // Remove isStreaming from dependency array

  // Add this new useEffect for component unmount cleanup
  useEffect(() => {
    return () => {
      // This will only run when the component is actually unmounting
      if (backendSessionIdRef.current) {
        stopBackendSession().catch(console.error);
      }
    };
  }, []); // Empty dependency array means this only runs on mount/unmount

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const isSingificantChange = (newText, oldText) => {
    if (!newText || !oldText) return false;
    if (Math.abs(newText.length - oldText.length) < 5) return false;
    if (newText.length < oldText.length) return false;
    const newWords = newText.split(' ').length;
    const oldWords = oldText.split(' ').length;
    return newWords >= oldWords + 2;
  };

  const connectTranslationStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const streamUrl = `https://churchtranslator.com:4586/stream_translation/${selectedLanguage}?client_id=${clientIdRef.current}&role=listener`;
    eventSourceRef.current = new EventSource(streamUrl);

    eventSourceRef.current.onmessage = async (event) => {
      console.log('Receiving the voice');
      try {
        console.log('Receiving the voice22');

        const data = JSON.parse(event.data);
        console.log('DATA', data);
        if (!data.keepalive && data.translation) {
          setTranscription(data.translation);

          try {
            const response = await fetch('https://churchtranslator.com:4586/synthesize_speech', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg'
              },
              body: JSON.stringify({
                text: data.translation,
                language: selectedLanguage,
                voice: 'neural'
              })
            });

            if (!response.ok) {
              throw new Error(`Speech synthesis failed: ${response.status}`);
            }

            const audioBlob = await response.blob();
            if (audioBlob.size === 0) {
              throw new Error('Received empty audio response');
            }

            await audioManagerRef.current.playAudio(audioBlob);
          } catch (error) {
            console.error('Speech error:', error);
            setError(`Speech synthesis error: ${error.message}`);
            setTimeout(() => setError(''), 3000);
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        setError(`Stream error: ${error.message}`);
      }
    };

    eventSourceRef.current.onopen = () => {
      setStatus('Connected');
    };

    eventSourceRef.current.onerror = () => {
      setStatus('Connection lost. Please refresh the page.');
    };
  };

  // Start translation session
  const handleStart = async () => {
    if (!isLiveSermonAvailable) {
      setError('No live sermon available');
      return;
    }

    try {

      const [backendSessionPromise, streamPromise] = await Promise.all([
        startBackendSession(),
        fetch('https://churchtranslator.com:4586/start_stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: clientIdRef.current,
            role: 'listener'
          })
        })
      ]);

      const streamResponse = await streamPromise;
      if (!streamResponse.ok) {
        throw new Error('Failed to start stream');
      }


      if (!backendSessionPromise) {
        console.warn('Backend session creation failed');
      }

      setIsStreaming(true);
      setStatus('Connected');
      setError('');
      setTranscription('');
      connectTranslationStream();
    } catch (error) {
      console.error('Start error:', error);
      setError('Failed to start streaming');
      setIsStreaming(false);


      if (backendSessionIdRef.current) {
        stopBackendSession();
      }
    }
  };


  const handleJesusClick = async () => {
    // UI animation part
    const button = document.getElementById('acceptButton');
    const messageElement = document.getElementById('acceptMessage');

    button.classList.add('clicked');
    messageElement.style.display = 'block';

    // API call part
    try {
      const userId = localStorage.getItem('userId') || '67c55a62d9ecb28d98acdeae';
      const sermonId = liveSermon?._id || '67d7d430ca10078d42477fa8';

      const response = await axios.post(`${apiBaseUrl}/jesusclick/addstatus`, {
        userId,
        sermonId,
        jesusClicked: "Yes"
      });

      if (response.status === 200) {
        console.log('Jesus clicked successfully');
      }
    } catch (error) {
      console.error('Error in Jesus button click:', error);
    }

    // Reset animation after 3 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
      button.classList.remove('clicked');
    }, 3000);
  };

  // Add this event listener in useEffect or after component mounts
  useEffect(() => {
    const button = document.getElementById('acceptButton');
    if (button) {
      button.addEventListener('click', handleJesusClick);
    }

    // Cleanup
    return () => {
      if (button) {
        button.removeEventListener('click', handleJesusClick);
      }
    };
  }, []);



  const handleStop = async () => {
    try {
      // Stop stream and backend session simultaneously
      const streamStopPromise = fetch('https://churchtranslator.com:4586/stop_stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientIdRef.current })
      });

      // Make sure to await this
      await stopBackendSession();
      await streamStopPromise;

      // Close event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      setIsStreaming(false);
      setStatus('Disconnected');
      setShowTranslationView(false); // Return to sermon selection screen
      setTranscription('');
    } catch (error) {
      console.error('Stop error:', error);
      setError('Failed to stop streaming');
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (isStreaming) {
      connectTranslationStream();
    }
  };

  // New function to handle joining a sermon
  const handleJoinSermon = () => {
    setShowTranslationView(true);
  };

  const renderSermonSelectionScreen = () => {
    // Use the stable admin name
    let adminNameDisplay;

    if (!stableAdminInfo.isLoaded) {
      adminNameDisplay = (
        <Box component="span" display="inline-flex" alignItems="center">
          <CircularProgress size={16} thickness={5} sx={{ mr: 1 }} />
          Loading...
        </Box>
      );
    } else {
      adminNameDisplay = stableAdminInfo.name || "Unknown";
    }

    const sermonStartTime = liveSermon ? formatDate(liveSermon.startDateTime) : 'N/A';
    const sermonTitle = liveSermon?.title || 'Live Sermon';

    return (
      <StyledContainer maxWidth="lg">
        <SEO
          title="Live Church Sermons | Join a Live Sermon"
          description="Join live church sermons and experience real-time sermon translation in multiple languages."
          keywords="Live church sermons, Join sermon online, Church livestream, Online sermon translation"
          canonical="http://localhost:3000/live-sermon-translator"
        />


        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="700px" mx="auto" mb={2}>
            <Typography variant="h4" component="h1">
              Live Sermons
            </Typography>
            <div className="button-container">
              <div id="acceptButton">✋</div>
              <div id="acceptMessage">I accept Jesus.</div>
            </div>
          </Box>
        </>
        <style jsx>{`
  .button-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #acceptButton {
    position: relative;
    background-color: #333;
    color: white;
    font-size: 24px;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  #acceptButton:hover {
    background-color: #4C3628;
  }
  #acceptButton.clicked {
    transform: scale(1.3) rotate(360deg);
  }
  #acceptMessage {
    position: absolute;
    top: 100%;
    margin-top: 10px;
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    display: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    text-align: center;
  }
`}</style>

        {isLoading ? (
          <Box textAlign="center" py={4}>
            <Typography>Loading sermon data...</Typography>
          </Box>
        ) : (
          <Box mt={4} display="flex" justifyContent="center">
            {!isLiveSermonAvailable ? (
              <Alert severity="info" sx={{ mb: 3, width: "100%", maxWidth: 600, textAlign: "center" }}>
                There are no live sermons available at the moment. Please check back later.
              </Alert>
            ) : (
              <StyledCard sx={{ width: "100%", maxWidth: 700, padding: 3 }}>
                <CardContent>
                  {/* Title & Live Indicator */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">
                      {sermonTitle}
                    </Typography>
                    <LiveIndicator>LIVE NOW</LiveIndicator>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Sermon Info */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" color="text.secondary">
                      Initiator: <b>{adminNameDisplay}</b>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Start Time: <b>{sermonStartTime}</b>
                    </Typography>
                  </Box>
                </CardContent>

                {/* Join Button */}
                <CardActions sx={{ p: 2, justifyContent: "center" }}>
                  <StyledButton variant="contained" onClick={handleJoinSermon}>
                    Join Sermon
                  </StyledButton>
                </CardActions>
              </StyledCard>
            )}
          </Box>
        )}

        {userPreviousSession && (
          <StyledCard sx={{ width: "100%", maxWidth: 700, padding: 2, margin: "20px auto 24px auto" }}>
            <CardContent sx={{ padding: '12px !important' }}>
              <Typography variant="h6" component="h3" gutterBottom align="center">
                Your Previous Sessions
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 600, color: '#444', fontSize: '0.85rem', padding: '8px 10px' } }}>
                      <TableCell><b>Sr. No</b></TableCell>
                      <TableCell><b>Church Name</b></TableCell>
                      <TableCell><b>Initiator Name</b></TableCell>
                      <TableCell><b>Start Date Time</b></TableCell>
                      <TableCell><b>End Date Time</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPaginatedSessions().map((session, index) => {
                      const startIndex = (previousSessionsPage - 1) * ITEMS_PER_PAGE;

                      return (
                        <TableRow
                          key={`${session.sermonId}-${session.startDateTime}-${index}`}
                          sx={{
                            '& .MuiTableCell-body': { padding: '6px 10px', fontSize: '0.8rem' },
                            backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
                          }}
                        >
                          <TableCell>{startIndex + index + 1}</TableCell>
                          <TableCell>{session.churchName}</TableCell>
                          <TableCell>{session.adminName}</TableCell>
                          <TableCell>{formatDate(session.startDateTime)}</TableCell>
                          <TableCell>{formatDate(session.endDateTime)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {userPreviousSession.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Pagination
                    count={totalPreviousSessionPages}
                    page={previousSessionsPage}
                    onChange={handlePreviousSessionsPageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </StyledCard>
        )}
      </StyledContainer>
    );
  };

  // Render translation view
  const renderTranslationView = () => {
    const sermonTitle = liveSermon?.title || "Live Sermon";

    return (
      <StyledContainer maxWidth="lg">
        <SEO
          title="Live Church Sermon Translator | Real-Time Sermon Translation"
          description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
          keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
          canonical="http://localhost:3000/live-sermon-translator"
        />
        <StyledPaper>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" component="h1">
              {sermonTitle} <LiveIndicator>LIVE</LiveIndicator>
            </Typography>

            <StyledButton
              variant="contained"
              color="error"
              onClick={handleStop}
              size="small"
            >
              Leave Sermon
            </StyledButton>
          </Box>

          <ControlsBox>
            <StyledFormControl>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                disabled={isStreaming}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledButton
              variant="contained"
              onClick={isStreaming ? handleStop : handleStart}
              disabled={!isLiveSermonAvailable}
            >
              {isStreaming ? 'Stop Translation' : 'Start Translation'}
            </StyledButton>
          </ControlsBox>

          <StatusText variant="body2">Status: {status}</StatusText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TranscriptionBox elevation={0}>
            {transcription || 'Waiting for sermon translation to begin...'}
          </TranscriptionBox>
        </StyledPaper>
      </StyledContainer>
    );
  };

  // Main render method
  return showTranslationView && liveSermon ? renderTranslationView() : renderSermonSelectionScreen();
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default JoinLiveSermons;
=======
const TranscriptionContainer = styled(Paper)(({ theme }) => ({
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  height: '300px',
=======
>>>>>>> 9d8938c (latest code pushed to git)
  overflowY: 'auto',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '16px',
  lineHeight: 1.6
}));

const StatusText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  color: theme.palette.text.secondary
}));

class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.currentSource = null;
    this.audioQueue = [];
    this.isProcessing = false;
    this.lastPlaybackFinishTime = 0;
    this.minimumGapBetweenPlaybacks = 50;
  }

  async playAudio(audioData) {
    if (this.audioQueue.length > 1) {
      console.log(`[PLAY] Clearing queue of size ${this.audioQueue.length}`);
      this.audioQueue = [];
    }

    this.audioQueue.push(audioData);

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.audioQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.audioQueue.length > 0) {
        const audioData = this.audioQueue.shift();
        await this._playAudioInternal(audioData);

        const now = performance.now();
        const timeSinceLastPlayback = now - this.lastPlaybackFinishTime;
        if (timeSinceLastPlayback < this.minimumGapBetweenPlaybacks) {
          await new Promise((resolve) => setTimeout(resolve, this.minimumGapBetweenPlaybacks - timeSinceLastPlayback));
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async _playAudioInternal(audioData) {
    const playStart = performance.now();
    console.log(`[PLAY] Starting audio playback setup`);

    try {
      if (this.currentSource) {
        console.log(`[PLAY] Stopping previous audio`);
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) {
          console.log(`[PLAY] Error cleaning up previous audio:`, e);
        }
        this.currentSource = null;
      }

      if (this.audioContext.state === 'suspended') {
        console.log(`[PLAY] Resuming AudioContext`);
        await this.audioContext.resume();
      }

      const arrayBuffer = await audioData.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const source = this.audioContext.createBufferSource();
      this.currentSource = source;
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      console.log(`[PLAY] Starting playback`);
      source.start(0);

      await new Promise((resolve) => {
        source.onended = () => {
          const totalTime = performance.now() - playStart;
          console.log(`[PLAY] Playback finished in ${totalTime}ms`);
          this.lastPlaybackFinishTime = performance.now();
          if (this.currentSource === source) {
            this.currentSource = null;
          }
          resolve();
        };
      });
    } catch (error) {
      console.error(`[ERROR] Audio playback error:`, error);
      this.currentSource = null;
      throw error;
    }
  }
}

const JoinLiveSermons = () => {
  const [status, setStatus] = useState('Ready to start');
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLiveSermonAvailable, setIsLiveSermonAvailable] = useState(false);
  const [previousSessionsPage, setPreviousSessionsPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Consistent with your other components

  // New states for sermon selection screen
  const [sermonData, setSermonData] = useState([]);
  const [liveSermon, setLiveSermon] = useState(null);
  const [showTranslationView, setShowTranslationView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [endedSessionsData, setEndedSessionsData] = useState([]);
  const [userPreviousSession, setUserPreviousSession] = useState(null);
  const [isAdminNameLoading, setIsAdminNameLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [stableAdminInfo, setStableAdminInfo] = useState({
    name: '',
    isLoaded: false
  });


  const clientIdRef = useRef(generateUUID());
  const audioManagerRef = useRef(null);
  const eventSourceRef = useRef(null);
  const checkSermonIntervalRef = useRef(null);
  const checkSermonRef = useRef(null);
  const backendSessionIdRef = useRef(null);
  const adminUserRef = useRef(null);



  const getPaginatedSessions = () => {
    if (!userPreviousSession) return [];
    const startIndex = (previousSessionsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return userPreviousSession.slice(startIndex, endIndex);
  };

  // Handle page change for previous sessions
  const handlePreviousSessionsPageChange = (event, value) => {
    setPreviousSessionsPage(value);
  };


  // Calculate total pages for previous sessions
  const totalPreviousSessionPages = Math.ceil((userPreviousSession?.length || 0) / ITEMS_PER_PAGE);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const fetchLiveSermonData = useCallback(async () => {
    try {
      // Only set loading to true if we haven't loaded the admin name yet
      if (!stableAdminInfo.isLoaded) {
        setIsAdminNameLoading(true);
      }
  
      const response = await axios.get(`${apiBaseUrl}/sermon/checksermon`);
      console.log("Check Sermon API Response:", response.data);
  
      if (response.status !== 200) {
        throw new Error('Failed to fetch live sermons');
      }
  
      // Check if response.data is an empty array
      if (Array.isArray(response.data) && response.data.length === 0) {
        // If we're in translation view, reset the session
        if (showTranslationView) {
          // Reset session-related state
          setIsStreaming(false);
          setStatus('Disconnected');
          setShowTranslationView(false); // Return to sermon selection screen
          setTranscription('');
          setLiveSermon(null);
          setIsLiveSermonAvailable(false);
          backendSessionIdRef.current = null;
          setError('');
          setStableAdminInfo({
            name: '',
            isLoaded: false
          });
        }
        setIsLoading(false);
        setIsAdminNameLoading(false);
        return; // Exit early since we have no data to process
      }
  
      // Filter only live sermons
      const liveSermonData = response.data.find(sermon => sermon.status === 'Live');
  
      // If we have live sermon data and it has an adminStaffUserId
      // AND we haven't already loaded the admin info
      if (liveSermonData && liveSermonData.adminStaffUserId && !stableAdminInfo.isLoaded) {
        try {
          // Fetch admin user info only if we haven't loaded it yet
          const usersResponse = await axios.get(`${apiBaseUrl}/fetchAll`);
          const matchedUser = usersResponse.data.find(user => user._id === liveSermonData.adminStaffUserId);
  
          if (matchedUser) {
            // Add admin info directly to the liveSermonData object
            liveSermonData.adminStaff = {
              firstName: matchedUser.firstName,
              lastName: matchedUser.lastName
            };
  
            // Update the stable admin info
            setStableAdminInfo({
              name: `${matchedUser.firstName} ${matchedUser.lastName}`,
              isLoaded: true
            });
  
            setAdminUser(matchedUser);
          }
        } catch (adminError) {
          console.error('Error fetching admin data:', adminError);
        }
      }
  
      setLiveSermon(liveSermonData || null);
      setIsLiveSermonAvailable(!!liveSermonData);
      setIsLoading(false);
      setIsAdminNameLoading(false);
    } catch (error) {
      console.error('Error fetching live sermon data:', error);
      setIsLiveSermonAvailable(false);
      setIsLoading(false);
      setIsAdminNameLoading(false);
    }
  }, [stableAdminInfo.isLoaded, apiBaseUrl, showTranslationView]);

  
  useEffect(() => {
    fetchLiveSermonData();
    checkSermonIntervalRef.current = setInterval(fetchLiveSermonData, 3000);

    return () => {
      if (checkSermonIntervalRef.current) {
        clearInterval(checkSermonIntervalRef.current);
      }
      if (isStreaming && backendSessionIdRef.current) {
        stopBackendSession().catch(console.error);
      }
    };
  }, [fetchLiveSermonData, isStreaming]);

  
  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);


  // New function to start backend session
  const startBackendSession = async () => {
    try {
      if (!liveSermon) {
        console.warn("No live sermon found.");
        setError('No live sermon available.');
        return null;
      }

      const churchId = localStorage.getItem('churchId') || '66fbaf5bb02a5ffd85ca32f5';
      const userId = localStorage.getItem('userId');

      // Get current time in Indian timezone
      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach(part => {
          partsObj[part.type] = part.value;
        });

        // Format as ISO-like string: YYYY-MM-DDTHH:MM:SS+05:30
        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;

        return isoLike;
      };

      // Get the Indian time
      const indianTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/listen/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchId,
          sermonId: liveSermon._id,
          userId,
          startDateTime: indianTime, // Sending Indian time
          status: 'Live'
        })
      });

      if (!response.ok) throw new Error('Failed to create backend session');
      const data = await response.json();
      backendSessionIdRef.current = data._id;
      console.log('Backend session started:', data._id);
      return data;
    } catch (error) {
      console.error('Error in fetching live sermon or starting session:', error);
      setError('Failed to start backend session');
      return null;
    }
  };


  const stopBackendSession = async () => {
    if (!backendSessionIdRef.current) return;

    try {
      // Get current time in Indian timezone (same function used in startBackendSession)
      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach(part => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;

        return isoLike;
      };

      // Get the Indian time (same format as startBackendSession)
      const indianTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/listen/${backendSessionIdRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endDateTime: indianTime,
          status: 'End'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update backend session');
      }

      console.log('Backend session stopped');
      backendSessionIdRef.current = null;
    } catch (error) {
      console.error('Backend session stop error:', error);
    }
  };


  const fetchAndCompareData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/sermon/fetchAll`);
      console.log("Sermon API Response:", response.data);
      const adminStaffUserId = response.data.length > 0 ? response.data[0].adminStaffUserId : null;

      if (!adminStaffUserId) {
        console.warn("No adminStaffId found in sermons");
        return;
      }

      const usersResponse = await axios.get(`${apiBaseUrl}/fetchAll`);
      console.log("All Users API Response:", usersResponse.data);

      const matchedUser = usersResponse.data.find(user => user._id === adminStaffUserId);
      if (matchedUser) {
        // Compare with ref value to avoid unnecessary state updates
        if (!adminUserRef.current ||
          matchedUser._id !== adminUserRef.current._id ||
          matchedUser.firstName !== adminUserRef.current.firstName ||
          matchedUser.lastName !== adminUserRef.current.lastName) {

          adminUserRef.current = matchedUser;
          setAdminUser(matchedUser);
          console.log(`Admin Staff Name: ${matchedUser.firstName} ${matchedUser.lastName}`);
        }
      } else {
        console.warn("No matching user found for adminStaffId:", adminStaffUserId);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Set up the admin user data fetching
  useEffect(() => {
    fetchAndCompareData();
    checkSermonRef.current = setInterval(fetchAndCompareData, 3000);

    return () => {
      if (checkSermonRef.current) {
        clearInterval(checkSermonRef.current);
      }
    };
  }, [fetchAndCompareData]);

  const fetchEndedSessions = useCallback(async () => {
    try {
      const endedSessionsResponse = await axios.get(`${apiBaseUrl}/listen/getallusers`);
      console.log("Ended Sessions API Response:", endedSessionsResponse.data);
      setEndedSessionsData(endedSessionsResponse.data);

      // Get current user ID from localStorage
      const currentUserId = localStorage.getItem('userId');

      if (currentUserId && endedSessionsResponse.data.length > 0) {
        const userSessions = [];

        // Loop through all sermons
        for (const sermon of endedSessionsResponse.data) {
          // Check if this user exists in any sermon's listeners array
          const sessions = sermon.listeners.filter(
            listener => listener.userId === currentUserId
          );

          if (sessions.length > 0) {
            // Add all sessions for this user
            userSessions.push(...sessions.map(session => ({
              ...session,
              sermonId: sermon.sermonId,
              adminName: sermon.adminName,
              churchName: sermon.churchName,
              seniorPastor: sermon.seniorPastor
            })));
          }
        }

        // Set all previous sessions
        setUserPreviousSession(userSessions);
      }
    } catch (error) {
      console.error("Error fetching ended sessions:", error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!showTranslationView) {
      fetchEndedSessions();
    }
  }, [fetchEndedSessions, showTranslationView]);

  // Fetch sermon data on component mount - memoized to prevent unnecessary re-renders
  const fetchSermonData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/sermon/fetchAll`);
      console.log("Sermon API Response:", response.data);

      if (response.status !== 200) {
        throw new Error('Failed to fetch sermons');
      }

      // Check if there's any actual change before updating state
      const liveSermonFound = response.data.find(sermon => sermon.status === 'Live');
      const hasSermonDataChanged = !sermonData.length ||
        JSON.stringify(sermonData) !== JSON.stringify(response.data);
      const hasLiveSermonChanged = !liveSermon ||
        !liveSermonFound ||
        liveSermon._id !== liveSermonFound._id;

      // Only update state if there are actual changes
      if (hasSermonDataChanged) {
        setSermonData(response.data);
      }

      if (hasLiveSermonChanged) {
        setLiveSermon(liveSermonFound);
        setIsLiveSermonAvailable(!!liveSermonFound);
      }

      // Set loading to false only once
      if (isLoading) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching sermon data:', error);
      if (isLoading) {
        setError('Failed to fetch sermon data');
        setIsLiveSermonAvailable(false);
        setIsLoading(false);
      }
    }
  }, [sermonData, liveSermon, isLoading]);

  useEffect(() => {
    fetchLiveSermonData();
    checkSermonIntervalRef.current = setInterval(fetchLiveSermonData, 300000);

    return () => {
      if (checkSermonIntervalRef.current) {
        clearInterval(checkSermonIntervalRef.current);
      }
      // Remove this condition
      // if (isStreaming && backendSessionIdRef.current) {
      //   stopBackendSession().catch(console.error);
      // }
    };
  }, [fetchLiveSermonData]); // Remove isStreaming from dependency array

  // Add this new useEffect for component unmount cleanup
  useEffect(() => {
    return () => {
      // This will only run when the component is actually unmounting
      if (backendSessionIdRef.current) {
        stopBackendSession().catch(console.error);
      }
    };
  }, []); // Empty dependency array means this only runs on mount/unmount

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const isSingificantChange = (newText, oldText) => {
    if (!newText || !oldText) return false;
    if (Math.abs(newText.length - oldText.length) < 5) return false;
    if (newText.length < oldText.length) return false;
    const newWords = newText.split(' ').length;
    const oldWords = oldText.split(' ').length;
    return newWords >= oldWords + 2;
  };

  const connectTranslationStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const streamUrl = `https://churchtranslator.com:4586/stream_translation/${selectedLanguage}?client_id=${clientIdRef.current}&role=listener`;
    eventSourceRef.current = new EventSource(streamUrl);

    eventSourceRef.current.onmessage = async (event) => {
      console.log('Receiving the voice');
      try {
        console.log('Receiving the voice22');

        const data = JSON.parse(event.data);
        console.log('DATA', data);
        if (!data.keepalive && data.translation) {
          setTranscription(data.translation);

          try {
            const response = await fetch('https://churchtranslator.com:4586/synthesize_speech', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg'
              },
              body: JSON.stringify({
                text: data.translation,
                language: selectedLanguage,
                voice: 'neural'
              })
            });

            if (!response.ok) {
              throw new Error(`Speech synthesis failed: ${response.status}`);
            }

            const audioBlob = await response.blob();
            if (audioBlob.size === 0) {
              throw new Error('Received empty audio response');
            }

            await audioManagerRef.current.playAudio(audioBlob);
          } catch (error) {
            console.error('Speech error:', error);
            setError(`Speech synthesis error: ${error.message}`);
            setTimeout(() => setError(''), 3000);
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        setError(`Stream error: ${error.message}`);
      }
    };

    eventSourceRef.current.onopen = () => {
      setStatus('Connected');
    };

    eventSourceRef.current.onerror = () => {
      setStatus('Connection lost. Please refresh the page.');
    };
  };

  // Start translation session
  const handleStart = async () => {
    if (!isLiveSermonAvailable) {
      setError('No live sermon available');
      return;
    }

    try {

      const [backendSessionPromise, streamPromise] = await Promise.all([
        startBackendSession(),
        fetch('https://churchtranslator.com:4586/start_stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: clientIdRef.current,
            role: 'listener'
          })
        })
      ]);

      const streamResponse = await streamPromise;
      if (!streamResponse.ok) {
        throw new Error('Failed to start stream');
      }


      if (!backendSessionPromise) {
        console.warn('Backend session creation failed');
      }

      setIsStreaming(true);
      setStatus('Connected');
      setError('');
      setTranscription('');
      connectTranslationStream();
    } catch (error) {
      console.error('Start error:', error);
      setError('Failed to start streaming');
      setIsStreaming(false);


      if (backendSessionIdRef.current) {
        stopBackendSession();
      }
    }
  };


  const handleJesusClick = async () => {
    // UI animation part
    const button = document.getElementById('acceptButton');
    const messageElement = document.getElementById('acceptMessage');

    button.classList.add('clicked');
    messageElement.style.display = 'block';

    // API call part
    try {
      const userId = localStorage.getItem('userId') || '67c55a62d9ecb28d98acdeae';
      const sermonId = liveSermon?._id || '67d7d430ca10078d42477fa8';

      const response = await axios.post(`${apiBaseUrl}/jesusclick/addstatus`, {
        userId,
        sermonId,
        jesusClicked: "Yes"
      });

      if (response.status === 200) {
        console.log('Jesus clicked successfully');
      }
    } catch (error) {
      console.error('Error in Jesus button click:', error);
    }

    // Reset animation after 3 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
      button.classList.remove('clicked');
    }, 3000);
  };

  // Add this event listener in useEffect or after component mounts
  useEffect(() => {
    const button = document.getElementById('acceptButton');
    if (button) {
      button.addEventListener('click', handleJesusClick);
    }

    // Cleanup
    return () => {
      if (button) {
        button.removeEventListener('click', handleJesusClick);
      }
    };
  }, []);



  const handleStop = async () => {
    try {
      // Stop stream and backend session simultaneously
      const streamStopPromise = fetch('https://churchtranslator.com:4586/stop_stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientIdRef.current })
      });

      // Make sure to await this
      await stopBackendSession();
      await streamStopPromise;

      // Close event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      setIsStreaming(false);
      setStatus('Disconnected');
      setShowTranslationView(false); // Return to sermon selection screen
      setTranscription('');
    } catch (error) {
      console.error('Stop error:', error);
      setError('Failed to stop streaming');
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (isStreaming) {
      connectTranslationStream();
    }
  };

  // New function to handle joining a sermon
  const handleJoinSermon = () => {
    setShowTranslationView(true);
  };

  const renderSermonSelectionScreen = () => {
    // Use the stable admin name
    let adminNameDisplay;

    if (!stableAdminInfo.isLoaded) {
      adminNameDisplay = (
        <Box component="span" display="inline-flex" alignItems="center">
          <CircularProgress size={16} thickness={5} sx={{ mr: 1 }} />
          Loading...
        </Box>
      );
    } else {
      adminNameDisplay = stableAdminInfo.name || "Unknown";
    }

    const sermonStartTime = liveSermon ? formatDate(liveSermon.startDateTime) : 'N/A';
    const sermonTitle = liveSermon?.title || 'Live Sermon';

    return (
      <StyledContainer maxWidth="lg">
        <SEO
          title="Live Church Sermons | Join a Live Sermon"
          description="Join live church sermons and experience real-time sermon translation in multiple languages."
          keywords="Live church sermons, Join sermon online, Church livestream, Online sermon translation"
          canonical="http://localhost:3000/live-sermon-translator"
        />


        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="700px" mx="auto" mb={2}>
            <Typography variant="h4" component="h1">
              Live Sermons
            </Typography>
            <div className="button-container">
              <div id="acceptButton">✋</div>
              <div id="acceptMessage">I accept Jesus.</div>
            </div>
          </Box>
        </>
        <style jsx>{`
  .button-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #acceptButton {
    position: relative;
    background-color: #333;
    color: white;
    font-size: 24px;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  #acceptButton:hover {
    background-color: #4C3628;
  }
  #acceptButton.clicked {
    transform: scale(1.3) rotate(360deg);
  }
  #acceptMessage {
    position: absolute;
    top: 100%;
    margin-top: 10px;
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    display: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    text-align: center;
  }
`}</style>

        {isLoading ? (
          <Box textAlign="center" py={4}>
            <Typography>Loading sermon data...</Typography>
          </Box>
        ) : (
          <Box mt={4} display="flex" justifyContent="center">
            {!isLiveSermonAvailable ? (
              <Alert severity="info" sx={{ mb: 3, width: "100%", maxWidth: 600, textAlign: "center" }}>
                There are no live sermons available at the moment. Please check back later.
              </Alert>
            ) : (
              <StyledCard sx={{ width: "100%", maxWidth: 700, padding: 3 }}>
                <CardContent>
                  {/* Title & Live Indicator */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">
                      {sermonTitle}
                    </Typography>
                    <LiveIndicator>LIVE NOW</LiveIndicator>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Sermon Info */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" color="text.secondary">
                      Initiator: <b>{adminNameDisplay}</b>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Start Time: <b>{sermonStartTime}</b>
                    </Typography>
                  </Box>
                </CardContent>

                {/* Join Button */}
                <CardActions sx={{ p: 2, justifyContent: "center" }}>
                  <StyledButton variant="contained" onClick={handleJoinSermon}>
                    Join Sermon
                  </StyledButton>
                </CardActions>
              </StyledCard>
            )}
          </Box>
        )}

        {userPreviousSession && (
          <StyledCard sx={{ width: "100%", maxWidth: 700, padding: 2, margin: "20px auto 24px auto" }}>
            <CardContent sx={{ padding: '12px !important' }}>
              <Typography variant="h6" component="h3" gutterBottom align="center">
                Your Previous Sessions
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 600, color: '#444', fontSize: '0.85rem', padding: '8px 10px' } }}>
                      <TableCell><b>Sr. No</b></TableCell>
                      <TableCell><b>Church Name</b></TableCell>
                      <TableCell><b>Initiator Name</b></TableCell>
                      <TableCell><b>Start Date Time</b></TableCell>
                      <TableCell><b>End Date Time</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPaginatedSessions().map((session, index) => {
                      const startIndex = (previousSessionsPage - 1) * ITEMS_PER_PAGE;

                      return (
                        <TableRow
                          key={`${session.sermonId}-${session.startDateTime}-${index}`}
                          sx={{
                            '& .MuiTableCell-body': { padding: '6px 10px', fontSize: '0.8rem' },
                            backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
                          }}
                        >
                          <TableCell>{startIndex + index + 1}</TableCell>
                          <TableCell>{session.churchName}</TableCell>
                          <TableCell>{session.adminName}</TableCell>
                          <TableCell>{formatDate(session.startDateTime)}</TableCell>
                          <TableCell>{formatDate(session.endDateTime)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {userPreviousSession.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Pagination
                    count={totalPreviousSessionPages}
                    page={previousSessionsPage}
                    onChange={handlePreviousSessionsPageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </StyledCard>
        )}
      </StyledContainer>
    );
  };

  // Render translation view
  const renderTranslationView = () => {
    const sermonTitle = liveSermon?.title || "Live Sermon";

    return (
      <StyledContainer maxWidth="lg">
        <SEO
          title="Live Church Sermon Translator | Real-Time Sermon Translation"
          description="Experience real-time sermon translation and multilingual church services with our live church sermon translator."
          keywords="Church sermon translator, Live sermon translation, Real-time sermon interpreter, Multilingual church services, Translate sermons online, Worship service translation, Bible sermon translation"
          canonical="http://localhost:3000/live-sermon-translator"
        />
        <StyledPaper>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" component="h1">
              {sermonTitle} <LiveIndicator>LIVE</LiveIndicator>
            </Typography>

            <StyledButton
              variant="contained"
              color="error"
              onClick={handleStop}
              size="small"
            >
              Leave Sermon
            </StyledButton>
          </Box>

          <ControlsBox>
            <StyledFormControl>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                disabled={isStreaming}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledButton
              variant="contained"
              onClick={isStreaming ? handleStop : handleStart}
              disabled={!isLiveSermonAvailable}
            >
              {isStreaming ? 'Stop Translation' : 'Start Translation'}
            </StyledButton>
          </ControlsBox>

          <StatusText variant="body2">Status: {status}</StatusText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TranscriptionBox elevation={0}>
            {transcription || 'Waiting for sermon translation to begin...'}
          </TranscriptionBox>
        </StyledPaper>
      </StyledContainer>
    );
  };

  // Main render method
  return showTranslationView && liveSermon ? renderTranslationView() : renderSermonSelectionScreen();
};

<<<<<<< HEAD
export default JoinLiveSermon;
>>>>>>> c307fdc (New changes)
=======
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default JoinLiveSermons;
>>>>>>> 9d8938c (latest code pushed to git)

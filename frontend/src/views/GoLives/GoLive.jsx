import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9d8938c (latest code pushed to git)
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
<<<<<<< HEAD

const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ready to start');
=======
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../index.scss';

const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('Ready to start');
>>>>>>> c307fdc (New changes)
=======

const GoLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ready to start');
>>>>>>> 9d8938c (latest code pushed to git)
  const [transcription, setTranscription] = useState('');
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState('');
  const [microphones, setMicrophones] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
<<<<<<< HEAD
<<<<<<< HEAD
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSermonId, setCurrentSermonId] = useState(null); // Added from 2nd code

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).substring(7));
  const lastSpeechTimestampRef = useRef(Date.now());
  const translationSourceRef = useRef(null);
  const retriesRef = useRef(0);
  const segmentStartTimeRef = useRef(Date.now());
  const metricsSystemRef = useRef(null);

  // Sliding window state
  const slidingWindowStateRef = useRef({
    wordBuffer: [],
    lastTranslatedIndex: 0,
    pendingTranslations: new Map(),
    translationResponses: new Map(),
    segmentId: 0,
    lastTranslationTimestamp: Date.now()
  });

  // Sliding window buffer
  const slidingWindowBufferRef = useRef({
    segments: new Map(),
    lastDisplayed: null,
    pendingChunks: 0,
    enabled: true
  });

  const SPEECH_CONFIG = {
    PAUSE_DURATION: 300,
    FINAL_PAUSE_DURATION: 700,
    MAX_DURATION: 5000,
    MIN_SPEECH_LENGTH: 3,
    MIN_NEW_CHARS: 15,
    MAX_INTERIM_LENGTH: 150,
    WORD_COUNT_THRESHOLD: 20,
    MIN_WORDS_FOR_TRANSLATION: 3,
    WINDOW_SIZE: 12,
    WINDOW_OVERLAP: 1,
    WINDOW_MIN_SIZE: 1,
    USE_SLIDING_WINDOW: true,
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

  // Create metrics system for performance tracking
  const createMetricsSystem = () => {
    const metricsState = {
      translationCount: 0,
      totalChunks: 0,
      totalWordCount: 0,
      renderTimes: [],
      translationLatencies: [],
      startTime: Date.now(),
      lastReportTime: Date.now()
    };
    
    const calculateAverage = (array) => {
      if (!array || array.length === 0) return 0;
      return array.reduce((sum, val) => sum + val, 0) / array.length;
    };
    
    const reportingInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpan = (currentTime - metricsState.lastReportTime) / 1000;
      
      const averageChunkSize = metricsState.totalChunks > 0 
        ? metricsState.totalWordCount / metricsState.totalChunks 
        : 0;
        
      const avgRenderTime = calculateAverage(metricsState.renderTimes);
      const avgLatency = calculateAverage(metricsState.translationLatencies);
      
      console.log(`[SLIDING_WINDOW] Performance Report:
        Time period: ${timeSpan.toFixed(1)}s
        Translations: ${metricsState.translationCount}
        Chunks processed: ${metricsState.totalChunks}
        Avg chunk size: ${averageChunkSize.toFixed(1)} words
        Avg render time: ${avgRenderTime.toFixed(2)}ms
        Avg translation latency: ${avgLatency.toFixed(2)}ms
      `);
      
      metricsState.translationCount = 0;
      metricsState.totalChunks = 0;
      metricsState.totalWordCount = 0;
      metricsState.renderTimes = [];
      metricsState.translationLatencies = [];
      metricsState.lastReportTime = currentTime;
    }, 30000);
    
    return {
      recordTranslation: function(wordCount, latency) {
        if (typeof wordCount !== 'number' || isNaN(wordCount)) {
          console.warn('[METRICS] Invalid word count:', wordCount);
          wordCount = 0;
        }
        
        if (typeof latency !== 'number' || isNaN(latency)) {
          console.warn('[METRICS] Invalid latency:', latency);
          latency = 0;
        }
        
        metricsState.translationCount++;
        metricsState.totalChunks++;
        metricsState.totalWordCount += wordCount;
        
        if (latency > 0) {
          metricsState.translationLatencies.push(latency);
        }
        
        console.log(`[METRICS_DETAIL] Translation recorded: ${wordCount} words, ${latency.toFixed(2)}ms latency`);
      },
      
      recordRender: function(renderTime) {
        if (typeof renderTime !== 'number' || isNaN(renderTime)) {
          console.warn('[METRICS] Invalid render time:', renderTime);
          renderTime = 0;
        }
        
        if (renderTime > 0) {
          metricsState.renderTimes.push(renderTime);
          console.log(`[METRICS_DETAIL] Render time recorded: ${renderTime.toFixed(2)}ms`);
        }
      },
      
      cleanup: function() {
        clearInterval(reportingInterval);
        console.log('[METRICS] Metrics system cleaned up');
      }
    };
  };

  useEffect(() => {
    metricsSystemRef.current = createMetricsSystem();
    console.log('[INIT] Metrics system initialized');
    
    return () => {
      if (metricsSystemRef.current) {
        metricsSystemRef.current.cleanup();
      }
    };
  }, []);
=======
  
=======
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSermonId, setCurrentSermonId] = useState(null); // Added from 2nd code

>>>>>>> 9d8938c (latest code pushed to git)
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).substring(7));
  const lastSpeechTimestampRef = useRef(Date.now());
  const translationSourceRef = useRef(null);
  const retriesRef = useRef(0);
  const segmentStartTimeRef = useRef(Date.now());
  const metricsSystemRef = useRef(null);

  // Sliding window state
  const slidingWindowStateRef = useRef({
    wordBuffer: [],
    lastTranslatedIndex: 0,
    pendingTranslations: new Map(),
    translationResponses: new Map(),
    segmentId: 0,
    lastTranslationTimestamp: Date.now()
  });

  // Sliding window buffer
  const slidingWindowBufferRef = useRef({
    segments: new Map(),
    lastDisplayed: null,
    pendingChunks: 0,
    enabled: true
  });

  const SPEECH_CONFIG = {
    PAUSE_DURATION: 300,
    FINAL_PAUSE_DURATION: 700,
    MAX_DURATION: 5000,
    MIN_SPEECH_LENGTH: 3,
    MIN_NEW_CHARS: 15,
    MAX_INTERIM_LENGTH: 150,
    WORD_COUNT_THRESHOLD: 20,
    MIN_WORDS_FOR_TRANSLATION: 3,
    WINDOW_SIZE: 12,
    WINDOW_OVERLAP: 1,
    WINDOW_MIN_SIZE: 1,
    USE_SLIDING_WINDOW: true,
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

  // Create metrics system for performance tracking
  const createMetricsSystem = () => {
    const metricsState = {
      translationCount: 0,
      totalChunks: 0,
      totalWordCount: 0,
      renderTimes: [],
      translationLatencies: [],
      startTime: Date.now(),
      lastReportTime: Date.now()
    };
    
    const calculateAverage = (array) => {
      if (!array || array.length === 0) return 0;
      return array.reduce((sum, val) => sum + val, 0) / array.length;
    };
    
    const reportingInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpan = (currentTime - metricsState.lastReportTime) / 1000;
      
      const averageChunkSize = metricsState.totalChunks > 0 
        ? metricsState.totalWordCount / metricsState.totalChunks 
        : 0;
        
      const avgRenderTime = calculateAverage(metricsState.renderTimes);
      const avgLatency = calculateAverage(metricsState.translationLatencies);
      
      console.log(`[SLIDING_WINDOW] Performance Report:
        Time period: ${timeSpan.toFixed(1)}s
        Translations: ${metricsState.translationCount}
        Chunks processed: ${metricsState.totalChunks}
        Avg chunk size: ${averageChunkSize.toFixed(1)} words
        Avg render time: ${avgRenderTime.toFixed(2)}ms
        Avg translation latency: ${avgLatency.toFixed(2)}ms
      `);
      
      metricsState.translationCount = 0;
      metricsState.totalChunks = 0;
      metricsState.totalWordCount = 0;
      metricsState.renderTimes = [];
      metricsState.translationLatencies = [];
      metricsState.lastReportTime = currentTime;
    }, 30000);
    
    return {
      recordTranslation: function(wordCount, latency) {
        if (typeof wordCount !== 'number' || isNaN(wordCount)) {
          console.warn('[METRICS] Invalid word count:', wordCount);
          wordCount = 0;
        }
        
        if (typeof latency !== 'number' || isNaN(latency)) {
          console.warn('[METRICS] Invalid latency:', latency);
          latency = 0;
        }
        
        metricsState.translationCount++;
        metricsState.totalChunks++;
        metricsState.totalWordCount += wordCount;
        
        if (latency > 0) {
          metricsState.translationLatencies.push(latency);
        }
        
        console.log(`[METRICS_DETAIL] Translation recorded: ${wordCount} words, ${latency.toFixed(2)}ms latency`);
      },
      
      recordRender: function(renderTime) {
        if (typeof renderTime !== 'number' || isNaN(renderTime)) {
          console.warn('[METRICS] Invalid render time:', renderTime);
          renderTime = 0;
        }
        
        if (renderTime > 0) {
          metricsState.renderTimes.push(renderTime);
          console.log(`[METRICS_DETAIL] Render time recorded: ${renderTime.toFixed(2)}ms`);
        }
      },
      
      cleanup: function() {
        clearInterval(reportingInterval);
        console.log('[METRICS] Metrics system cleaned up');
      }
    };
  };

  useEffect(() => {
    metricsSystemRef.current = createMetricsSystem();
    console.log('[INIT] Metrics system initialized');
    
    return () => {
      if (metricsSystemRef.current) {
        metricsSystemRef.current.cleanup();
      }
    };
  }, []);

  const logMicrophoneDetails = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === 'audioinput');
      
      console.group('Available Microphones');
      mics.forEach((mic, index) => {
        console.log(`Microphone ${index + 1}:`, {
          label: mic.label,
          deviceId: mic.deviceId.substring(0, 8) + '...',
          isDefault: index === 0
        });
      });
      console.groupEnd();
      
      return mics;
    } catch (error) {
      console.error('Error getting microphones:', error);
      return [];
    }
  };

  const processSlidingWindow = (transcript, isInterim) => {
    if (!SPEECH_CONFIG.USE_SLIDING_WINDOW) return;

    const processStart = performance.now();
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];
    
    const words = transcript.trim().split(/\s+/);
    if (words.length === 0) return;

    slidingWindowStateRef.current.wordBuffer = words;
    
    const slideIncrement = SPEECH_CONFIG.WINDOW_SIZE - SPEECH_CONFIG.WINDOW_OVERLAP;

    let windowsProcessed = 0;
    let totalWordsProcessed = 0;
    
    while (slidingWindowStateRef.current.lastTranslatedIndex + SPEECH_CONFIG.WINDOW_SIZE <= words.length) {
      const windowStart = slidingWindowStateRef.current.lastTranslatedIndex;
      const windowEnd = windowStart + SPEECH_CONFIG.WINDOW_SIZE;
      const chunk = words.slice(windowStart, windowEnd).join(' ');
      
      if (chunk.length >= SPEECH_CONFIG.MIN_SPEECH_LENGTH) {
        const translationId = `${Date.now()}-${slidingWindowStateRef.current.segmentId++}`;
        
        translateChunk(chunk, translationId, windowStart, windowEnd, isInterim);

        windowsProcessed++;
        totalWordsProcessed += (windowEnd - windowStart);
        
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Processing window ${windowStart}-${windowEnd}: ${words.length} words total`);
        
        slidingWindowStateRef.current.lastTranslatedIndex += slideIncrement;
        
        slidingWindowStateRef.current.lastTranslationTimestamp = Date.now();
      } else {
        slidingWindowStateRef.current.lastTranslatedIndex++;
      }
    }
    
    if (!isInterim && slidingWindowStateRef.current.lastTranslatedIndex < words.length) {
      const remainingWords = words.length - slidingWindowStateRef.current.lastTranslatedIndex;
      
      if (remainingWords >= SPEECH_CONFIG.WINDOW_MIN_SIZE) {
        const finalChunk = words.slice(slidingWindowStateRef.current.lastTranslatedIndex).join(' ');
        const finalId = `final-${Date.now()}-${slidingWindowStateRef.current.segmentId++}`;
        
        translateChunk(finalChunk, finalId, 
                    slidingWindowStateRef.current.lastTranslatedIndex, words.length, false);

        windowsProcessed++;
        totalWordsProcessed += remainingWords;
                            
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Processing final chunk: ${remainingWords} words`);
      }
      
      slidingWindowStateRef.current.wordBuffer = [];
      slidingWindowStateRef.current.lastTranslatedIndex = 0;
    }

    if (windowsProcessed > 0) {
      const processingTime = performance.now() - processStart;
      console.log(`[${formattedTime}] [METRICS] Processed ${windowsProcessed} windows with ${totalWordsProcessed} words in ${processingTime.toFixed(2)}ms`);
    }
  };

  const translateChunk = async (text, id, startIdx, endIdx, isInterim) => {
    const startTime = performance.now();
    const clientRequestTime = Date.now();
    const wordCount = text.split(/\s+/).length;
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];

    slidingWindowStateRef.current.pendingTranslations.set(id, {
      originalText: text,
      startPosition: startIdx,
      endPosition: endIdx,
      isInterim: isInterim,
      timestamp: Date.now(),
      startTime: startTime,
      wordCount: wordCount 
    });

    console.log(`[TRANSLATION_REQUEST] ID: ${id}, Text: "${text}"`);
    
    try {
      const response = await fetch('https://churchtranslator.com:4586/translate_realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          clientId: clientIdRef.current,
          slidingWindowInfo: {
            segmentId: id,
            startWord: startIdx,
            endWord: endIdx,
            isInterim: isInterim
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`[${formattedTime}] [SLIDING_WINDOW] Translation error for chunk ${id}:`, error);
      slidingWindowStateRef.current.pendingTranslations.delete(id);
    }

    const processingTime = performance.now() - startTime;
    console.log(`[SLIDING_WINDOW] Request processing: ${processingTime.toFixed(2)}ms for ${wordCount} words`);
    
    if (metricsSystemRef.current) {
      metricsSystemRef.current.recordTranslation(wordCount, processingTime);
    }
    
    console.log(`[${formattedTime}] [METRICS] chunk_sent,${id},${startIdx},${endIdx},${wordCount}`);
  };

  const stitchTranslations = (previousTranslation, currentTranslation, overlapWordCount) => {
    if (!previousTranslation) return currentTranslation;
    if (!currentTranslation) return previousTranslation;
    
    if (!overlapWordCount || overlapWordCount <= 0) {
      return previousTranslation + ' ' + currentTranslation;
    }
    
    const prevWords = previousTranslation.split(/\s+/);
    const currWords = currentTranslation.split(/\s+/);
    
    if (prevWords.length < overlapWordCount || currWords.length < overlapWordCount) {
      return previousTranslation + ' ' + currentTranslation;
    }
    
    const prevOverlap = prevWords.slice(-overlapWordCount);
    const currOverlap = currWords.slice(0, overlapWordCount);
    
    let matchCount = 0;
    for (let i = 0; i < overlapWordCount; i++) {
      if (prevOverlap[i].toLowerCase() === currOverlap[i].toLowerCase()) {
        matchCount++;
      }
    }
    
    const similarityScore = matchCount / overlapWordCount;
    
    if (similarityScore > 0.5) {
      return prevWords.slice(0, -overlapWordCount).join(' ') + ' ' + 
          currWords.join(' ');
    } else {
      return previousTranslation + ' | ' + currentTranslation;
    }
  };

  const handleSlidingWindowTranslation = (data) => {
    const { translation, slidingWindowInfo } = data;
    if (!slidingWindowInfo) return;
    
    const { segmentId, startWord, endWord, isInterim } = slidingWindowInfo;
    const currentTime = Date.now();
    const formattedTime = new Date(currentTime).toISOString().split('T')[1].split('Z')[0];

    const translationStart = performance.now();

    const originalRequest = slidingWindowStateRef.current.pendingTranslations.get(segmentId);
    
    if (originalRequest) {
      const requestToResponseLatency = currentTime - originalRequest.timestamp;
      const processingLatency = performance.now() - originalRequest.startTime;
      
      if (metricsSystemRef.current) {
        metricsSystemRef.current.recordTranslation(
          originalRequest.wordCount,
          processingLatency
        );
      }
    
      console.log(`[${formattedTime}] [METRICS] Translation latency: ${processingLatency.toFixed(2)}ms for segment ${segmentId}, ${requestToResponseLatency}ms total`);
    }

    console.log(`[${formattedTime}] [SLIDING_WINDOW] Received translation segment ${segmentId} (${startWord}-${endWord}): "${translation.substring(0, 40)}${translation.length > 40 ? '...' : ''}"`);
    
    slidingWindowBufferRef.current.segments.set(startWord, {
      id: segmentId,
      startPosition: startWord,
      endPosition: endWord, 
      translation: translation,
      timestamp: currentTime,
      isInterim: isInterim,
      processingTime: performance.now() - translationStart
    });

    const allSegments = Array.from(slidingWindowBufferRef.current.segments.entries())
      .sort((a, b) => a[0] - b[0]);
    
    let previousSegment = null;
    for (let i = allSegments.length - 1; i >= 0; i--) {
      const [prevStartPos, segmentData] = allSegments[i];
      if (prevStartPos < startWord && segmentData.id !== segmentId) {
        previousSegment = segmentData;
        break;
      }
    }

    if (previousSegment && previousSegment.endPosition > startWord) {
      const overlapSize = previousSegment.endPosition - startWord;
      
      console.log(`[OVERLAP_DETECTED] Between segments ${previousSegment.id} and ${segmentId}`);
      console.log(`  Overlap size: ${overlapSize} words`);
      console.log(`  Previous segment position: ${previousSegment.startPosition}-${previousSegment.endPosition}`);
      console.log(`  Current segment position: ${startWord}-${endWord}`);
      
      const prevWords = previousSegment.translation.split(/\s+/);
      const currWords = translation.split(/\s+/);
      
      const prevOverlap = prevWords.slice(-Math.min(overlapSize, prevWords.length)).join(' ');
      const currOverlap = currWords.slice(0, Math.min(overlapSize, currWords.length)).join(' ');
      
      console.log(`  Previous overlap text: "${prevOverlap}"`);
      console.log(`  Current overlap text: "${currOverlap}"`);
      
      const similarityScore = calculateSimilarityScore(prevOverlap, currOverlap);
      console.log(`  Similarity score: ${similarityScore.toFixed(2)}`);
      
      const stitchingStrategy = similarityScore > 0.7 ? "merge_at_overlap" : "append_with_separator";
      console.log(`  Stitching strategy: ${stitchingStrategy}`);
    }

    slidingWindowBufferRef.current.pendingChunks++;
    
    renderSlidingWindowTranslation();
    
    if (slidingWindowBufferRef.current.pendingChunks > 20) {
      cleanupOldSegments();
    }
  };

  const calculateSimilarityScore = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    const normalize = t => t.toLowerCase().replace(/[.,?!;:'"()]/g, '').trim();
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    if (!norm1 || !norm2) return 0;
    
    const words1 = norm1.split(/\s+/);
    const words2 = norm2.split(/\s+/);
    
    let matchCount = 0;
    const minLength = Math.min(words1.length, words2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (words1[i] === words2[i]) matchCount++;
    }
    
    return minLength > 0 ? matchCount / minLength : 0;
  };

  const renderSlidingWindowTranslation = () => {
    const renderStart = performance.now();
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];

    if (slidingWindowBufferRef.current.segments.size === 0) {
      return;
    }
    
    const sortedSegments = Array.from(slidingWindowBufferRef.current.segments.values())
      .sort((a, b) => a.startPosition - b.startPosition);
    
    const currentTime = Date.now();
    
    if (sortedSegments.length === 1) {
      if (sortedSegments[0].translation !== slidingWindowBufferRef.current.lastDisplayed) {
        setTranscription(sortedSegments[0].translation);
        slidingWindowBufferRef.current.lastDisplayed = sortedSegments[0].translation;
        
        const renderTime = performance.now() - renderStart;
        if (metricsSystemRef.current) {
          metricsSystemRef.current.recordRender(renderTime);
        }
        
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Rendered single segment in ${renderTime.toFixed(2)}ms`);
      }
      return;
    }

    let stitchedTranslation = sortedSegments[0].translation;
    let lastEndPosition = sortedSegments[0].endPosition;
    
    for (let i = 1; i < sortedSegments.length; i++) {
      const segment = sortedSegments[i];
      
      if (segment.endPosition <= lastEndPosition) {
        continue;
      }
      
      const segmentAge = currentTime - segment.timestamp;
      if (segmentAge < 100 && !sortedSegments[i].isInterim) {
        continue;
      }
      
      if (segment.startPosition < lastEndPosition) {
        const overlapCount = lastEndPosition - segment.startPosition;
        stitchedTranslation = stitchTranslations(
          stitchedTranslation,
          segment.translation,
          overlapCount
        );
      } else {
        stitchedTranslation += ' ' + segment.translation;
      }
      
      lastEndPosition = Math.max(lastEndPosition, segment.endPosition);
    }
    
    if (stitchedTranslation !== slidingWindowBufferRef.current.lastDisplayed) {
      setTranscription(stitchedTranslation);
      slidingWindowBufferRef.current.lastDisplayed = stitchedTranslation;
      slidingWindowBufferRef.current.pendingChunks = 0;

      const renderTime = performance.now() - renderStart;
      if (metricsSystemRef.current) {
        metricsSystemRef.current.recordRender(renderTime);
      }
      
      console.log(`[${formattedTime}] [SLIDING_WINDOW] Rendered ${sortedSegments.length} segments in ${renderTime.toFixed(2)}ms`);
    }
  };

  const cleanupOldSegments = () => {
    const currentTime = Date.now();
    const MAX_AGE_MS = 10000;
    
    for (const [startPosition, segment] of slidingWindowBufferRef.current.segments.entries()) {
      if (currentTime - segment.timestamp > MAX_AGE_MS) {
        slidingWindowBufferRef.current.segments.delete(startPosition);
      }
    }
    
    slidingWindowBufferRef.current.pendingChunks = Math.min(
      slidingWindowBufferRef.current.pendingChunks, 
      slidingWindowBufferRef.current.segments.size
    );
    
    console.log(`[SLIDING_WINDOW] Cleaned up old segments. ${slidingWindowBufferRef.current.segments.size} segments remaining.`);
  };

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
      segmentStartTimeRef.current = Date.now();
      retriesRef.current = 0;
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        const delay = Math.min(50 * Math.pow(2, retriesRef.current), 2000);
        retriesRef.current++;

        setTimeout(() => {
          try {
            if (isRecording) {
              recognitionRef.current.start();
              console.log(`Recognition restarted after ${delay}ms delay`);
            }
          } catch (e) {
            console.error('Error restarting recognition:', e);
            if (retriesRef.current < 5) {
              setTimeout(() => {
                initializeSpeechRecognition();
                recognitionRef.current.start();
              }, 1000);
            } else {
              setError('Too many restart attempts. Please try again.');
              setIsRecording(false);
            }
          }
        }, delay);
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
      } else if (event.error === 'audio-capture' || event.error === 'not-allowed') {
        setError(`Microphone error: ${event.error}. Please check your microphone permissions.`);
        setIsRecording(false);
      } else {
        setError(`Recognition error: ${event.error}`);
      }
    };

    recognitionRef.current.onresult = handleRecognitionResult;
    return true;
  };

  const handleRecognitionResult = (event) => {
    const currentTime = Date.now();
    const formattedTime = new Date(currentTime).toISOString().split('T')[1].split('Z')[0];

    console.log(`[${formattedTime}] Recognition result received`);

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      const timeSinceLastSpeech = currentTime - lastSpeechTimestampRef.current;
      const segmentDuration = currentTime - segmentStartTimeRef.current;
      const isInterim = !event.results[i].isFinal;

      const wordCount = transcript.trim().split(/\s+/).length;
      const isLongEnough = wordCount >= SPEECH_CONFIG.WORD_COUNT_THRESHOLD;
      
      if (isInterim) {
        setTranscription(transcript + '...');
      } else {
        setTranscription(transcript);
      }

      if (SPEECH_CONFIG.USE_SLIDING_WINDOW) {
        processSlidingWindow(transcript, isInterim);
        
        if (timeSinceLastSpeech >= SPEECH_CONFIG.PAUSE_DURATION) {
          lastSpeechTimestampRef.current = currentTime;
        }
        
        if (!isInterim) {
          lastSpeechTimestampRef.current = currentTime;
          
          if (transcript.endsWith('.') || 
              transcript.endsWith('!') || 
              transcript.endsWith('?') ||
              timeSinceLastSpeech > SPEECH_CONFIG.PAUSE_DURATION ||
              isLongEnough) {
            
            let resetReason = '';
            if (transcript.endsWith('.') || transcript.endsWith('!') || transcript.endsWith('?')) 
              resetReason = 'punctuation';
            else if (timeSinceLastSpeech > SPEECH_CONFIG.PAUSE_DURATION)
              resetReason = `${SPEECH_CONFIG.PAUSE_DURATION}ms pause`;
            else if (isLongEnough)
              resetReason = `word count threshold (${wordCount} words)`;
            
            segmentStartTimeRef.current = currentTime;
            console.log(`[${formattedTime}] Segment reset: ${resetReason}`);
          }
        }
      } else {
        if (!isInterim) {
          sendTranslationRequest(transcript, true);
        } else if (isLongEnough || timeSinceLastSpeech >= SPEECH_CONFIG.PAUSE_DURATION) {
          sendTranslationRequest(transcript, false);
          lastSpeechTimestampRef.current = currentTime;
        }
      }
    }
  };

  const sendTranslationRequest = async (text, isFinal) => {
    if (!text.trim() || text.length < SPEECH_CONFIG.MIN_SPEECH_LENGTH) return;

    try {
      const response = await fetch('https://churchtranslator.com:4586/translate_realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          clientId: clientIdRef.current,
          isFinal,
          wordCountTriggered: text.split(' ').length >= SPEECH_CONFIG.WORD_COUNT_THRESHOLD
        })
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      if (!error.message.includes('Failed to fetch')) {
        setError('Translation error occurred: ' + error.message);
      }
    }
  };

  const initializeTranslationStream = () => {
    if (translationSourceRef.current) {
      translationSourceRef.current.close();
    }

    translationSourceRef.current = new EventSource(
     `https://churchtranslator.com:4586/stream_translation/pt?client_id=${clientIdRef.current}&role=broadcaster`
    );

    translationSourceRef.current.onmessage = (event) => {
      try {
        const responseTimestamp = Date.now();
        const data = JSON.parse(event.data);
        
        if (data.keepalive) return;
        
        if (!data.translation) return;
        
        if (data.slidingWindowInfo) {
          handleSlidingWindowTranslation(data);
        } else {
          setTranscription(data.translation);
        }
      } catch (error) {
        console.error('Error processing translation:', error);
      }
    };

    translationSourceRef.current.onerror = (error) => {
      console.error('Translation stream error:', error);
      if (isRecording) {
        setTimeout(() => {
          if (isRecording) {
            initializeTranslationStream();
          }
        }, 2000);
      }
    };
  };

  // Add sermon to the API (from 2nd code)
  const addSermon = async () => {
    try {
      const checkLiveResponse = await fetch(`${apiBaseUrl}/sermon/checkLive`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!checkLiveResponse.ok) {
        throw new Error('Failed to check live sermons');
      }

      const liveData = await checkLiveResponse.json();

      const churchId = localStorage.getItem('churchId') || '';
      const adminStaffUserId = localStorage.getItem('userId');

      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach((part) => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;
        return isoLike;
      };

      const startDateTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/sermon/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          churchId,
          adminStaffUserId,
          startDateTime,
          status: 'Live',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add sermon');
      }

      const data = await response.json();
      const sermonId = data.sermon && data.sermon._id;
      setCurrentSermonId(sermonId);
      localStorage.setItem('currentSermonId', sermonId);
      console.log('Sermon added successfully:', data);
      return true;
    } catch (error) {
      console.error('Error adding sermon:', error);
      setError('Error adding sermon: ' + error.message);
      return false;
    }
  };

  // Update sermon status to 'End' (from 2nd code)
  const updateSermonStatus = async (sermonId = currentSermonId) => {
    if (!sermonId) {
      console.warn('No sermon ID available to update');
      return;
    }

    try {
      const churchId = localStorage.getItem('churchId') || '66fbaf5bb02a5ffd85ca32f5';
      const adminStaffId = localStorage.getItem('adminStaffId') || '67b5d2ebe467df285f8c9d3b';
      const userId = localStorage.getItem('userId');

      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach((part) => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;
        return isoLike;
      };

      const endDateTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/sermon/edit/${sermonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          churchId,
          adminStaffId,
          userId,
          endDateTime,
          status: 'End',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sermon status');
      }

      console.log('Sermon status updated to End');
      setCurrentSermonId(null);
      localStorage.removeItem('currentSermonId');
    } catch (error) {
      console.error('Error updating sermon status:', error);
      setError('Error updating sermon status: ' + error.message);
    }
  };

  useEffect(() => {
    const initializeMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput');
        await logMicrophoneDetails();

        setMicrophones(mics);
        
        if (mics.length === 0) {
          setError('No microphones found');
        } else {
          setError('');
          setSelectedMicrophoneId('');
        }

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

  // Check for active sermon on page refresh (from 2nd code)
  useEffect(() => {
    const storedSermonId = localStorage.getItem('currentSermonId');
    if (storedSermonId) {
      setCurrentSermonId(storedSermonId);
      updateSermonStatus(storedSermonId);
    }
  }, []);

  const startRecording = async () => {
    if (!isInitialized) {
      const initialized = initializeSpeechRecognition();
      if (!initialized) return;
      setIsInitialized(initialized);
    }

    try {
      // Reset sliding window state
      slidingWindowStateRef.current = {
        wordBuffer: [],
        lastTranslatedIndex: 0,
        pendingTranslations: new Map(),
        translationResponses: new Map(),
        segmentId: 0,
        lastTranslationTimestamp: Date.now()
      };
      
      slidingWindowBufferRef.current = {
        segments: new Map(),
        lastDisplayed: null,
        pendingChunks: 0,
        enabled: SPEECH_CONFIG.USE_SLIDING_WINDOW
      };

      // Run both APIs concurrently
      const startStreamPromise = fetch('https://churchtranslator.com:4586/start_stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceId: selectedMicrophoneId,
          deviceSettings: AUDIO_CONFIG,
          clientId: clientIdRef.current
        })
      }).then(response => {
        if (!response.ok) throw new Error('Failed to start stream');
        return response;
      });

      const addSermonPromise = addSermon();

      // Wait for both promises to resolve
      const [startStreamResponse, sermonAdded] = await Promise.all([
        startStreamPromise,
        addSermonPromise
      ]);

      if (!sermonAdded) {
        throw new Error('Failed to add sermon');
      }

      initializeTranslationStream();

      try {
        await recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
        const reinitialized = initializeSpeechRecognition();
        if (reinitialized) {
          try {
            await recognitionRef.current.start();
            setIsRecording(true);
          } catch (retryError) {
            throw new Error(`Failed to start recognition after retry: ${retryError.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Error starting stream: ' + error.message);
      setIsRecording(false);
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

      // Run both APIs concurrently
      const stopStreamPromise = fetch('https://churchtranslator.com:4586/stop_stream', {
        method: 'POST'
      }).then(response => {
        if (!response.ok) throw new Error('Failed to stop stream');
        return response;
      });

      const updateSermonPromise = updateSermonStatus();

      // Wait for both promises to resolve
      await Promise.all([stopStreamPromise, updateSermonPromise]);

      setStatus('Stopped');
      setTranscription('');
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Error stopping stream: ' + error.message);
    }
  };

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
<<<<<<< HEAD
  }, [isRecording]);
>>>>>>> c307fdc (New changes)

  const logMicrophoneDetails = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === 'audioinput');
      
      console.group('Available Microphones');
      mics.forEach((mic, index) => {
        console.log(`Microphone ${index + 1}:`, {
          label: mic.label,
          deviceId: mic.deviceId.substring(0, 8) + '...',
          isDefault: index === 0
        });
      });
      console.groupEnd();
      
      return mics;
    } catch (error) {
      console.error('Error getting microphones:', error);
      return [];
    }
  };

  const processSlidingWindow = (transcript, isInterim) => {
    if (!SPEECH_CONFIG.USE_SLIDING_WINDOW) return;

    const processStart = performance.now();
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];
    
    const words = transcript.trim().split(/\s+/);
    if (words.length === 0) return;

    slidingWindowStateRef.current.wordBuffer = words;
    
    const slideIncrement = SPEECH_CONFIG.WINDOW_SIZE - SPEECH_CONFIG.WINDOW_OVERLAP;

    let windowsProcessed = 0;
    let totalWordsProcessed = 0;
    
    while (slidingWindowStateRef.current.lastTranslatedIndex + SPEECH_CONFIG.WINDOW_SIZE <= words.length) {
      const windowStart = slidingWindowStateRef.current.lastTranslatedIndex;
      const windowEnd = windowStart + SPEECH_CONFIG.WINDOW_SIZE;
      const chunk = words.slice(windowStart, windowEnd).join(' ');
      
      if (chunk.length >= SPEECH_CONFIG.MIN_SPEECH_LENGTH) {
        const translationId = `${Date.now()}-${slidingWindowStateRef.current.segmentId++}`;
        
        translateChunk(chunk, translationId, windowStart, windowEnd, isInterim);

        windowsProcessed++;
        totalWordsProcessed += (windowEnd - windowStart);
        
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Processing window ${windowStart}-${windowEnd}: ${words.length} words total`);
        
        slidingWindowStateRef.current.lastTranslatedIndex += slideIncrement;
        
        slidingWindowStateRef.current.lastTranslationTimestamp = Date.now();
      } else {
        slidingWindowStateRef.current.lastTranslatedIndex++;
      }
    }
    
    if (!isInterim && slidingWindowStateRef.current.lastTranslatedIndex < words.length) {
      const remainingWords = words.length - slidingWindowStateRef.current.lastTranslatedIndex;
      
      if (remainingWords >= SPEECH_CONFIG.WINDOW_MIN_SIZE) {
        const finalChunk = words.slice(slidingWindowStateRef.current.lastTranslatedIndex).join(' ');
        const finalId = `final-${Date.now()}-${slidingWindowStateRef.current.segmentId++}`;
        
        translateChunk(finalChunk, finalId, 
                    slidingWindowStateRef.current.lastTranslatedIndex, words.length, false);

        windowsProcessed++;
        totalWordsProcessed += remainingWords;
                            
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Processing final chunk: ${remainingWords} words`);
      }
      
      slidingWindowStateRef.current.wordBuffer = [];
      slidingWindowStateRef.current.lastTranslatedIndex = 0;
    }

    if (windowsProcessed > 0) {
      const processingTime = performance.now() - processStart;
      console.log(`[${formattedTime}] [METRICS] Processed ${windowsProcessed} windows with ${totalWordsProcessed} words in ${processingTime.toFixed(2)}ms`);
    }
  };

  const translateChunk = async (text, id, startIdx, endIdx, isInterim) => {
    const startTime = performance.now();
    const clientRequestTime = Date.now();
    const wordCount = text.split(/\s+/).length;
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];

    slidingWindowStateRef.current.pendingTranslations.set(id, {
      originalText: text,
      startPosition: startIdx,
      endPosition: endIdx,
      isInterim: isInterim,
      timestamp: Date.now(),
      startTime: startTime,
      wordCount: wordCount 
    });

    console.log(`[TRANSLATION_REQUEST] ID: ${id}, Text: "${text}"`);
    
    try {
      const response = await fetch('https://churchtranslator.com:4586/translate_realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          clientId: clientIdRef.current,
          slidingWindowInfo: {
            segmentId: id,
            startWord: startIdx,
            endWord: endIdx,
            isInterim: isInterim
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`[${formattedTime}] [SLIDING_WINDOW] Translation error for chunk ${id}:`, error);
      slidingWindowStateRef.current.pendingTranslations.delete(id);
    }

    const processingTime = performance.now() - startTime;
    console.log(`[SLIDING_WINDOW] Request processing: ${processingTime.toFixed(2)}ms for ${wordCount} words`);
    
    if (metricsSystemRef.current) {
      metricsSystemRef.current.recordTranslation(wordCount, processingTime);
    }
    
    console.log(`[${formattedTime}] [METRICS] chunk_sent,${id},${startIdx},${endIdx},${wordCount}`);
  };

  const stitchTranslations = (previousTranslation, currentTranslation, overlapWordCount) => {
    if (!previousTranslation) return currentTranslation;
    if (!currentTranslation) return previousTranslation;
    
    if (!overlapWordCount || overlapWordCount <= 0) {
      return previousTranslation + ' ' + currentTranslation;
    }
    
    const prevWords = previousTranslation.split(/\s+/);
    const currWords = currentTranslation.split(/\s+/);
    
    if (prevWords.length < overlapWordCount || currWords.length < overlapWordCount) {
      return previousTranslation + ' ' + currentTranslation;
    }
    
    const prevOverlap = prevWords.slice(-overlapWordCount);
    const currOverlap = currWords.slice(0, overlapWordCount);
    
    let matchCount = 0;
    for (let i = 0; i < overlapWordCount; i++) {
      if (prevOverlap[i].toLowerCase() === currOverlap[i].toLowerCase()) {
        matchCount++;
      }
    }
    
    const similarityScore = matchCount / overlapWordCount;
    
    if (similarityScore > 0.5) {
      return prevWords.slice(0, -overlapWordCount).join(' ') + ' ' + 
          currWords.join(' ');
    } else {
      return previousTranslation + ' | ' + currentTranslation;
    }
  };

  const handleSlidingWindowTranslation = (data) => {
    const { translation, slidingWindowInfo } = data;
    if (!slidingWindowInfo) return;
    
    const { segmentId, startWord, endWord, isInterim } = slidingWindowInfo;
    const currentTime = Date.now();
    const formattedTime = new Date(currentTime).toISOString().split('T')[1].split('Z')[0];

    const translationStart = performance.now();

    const originalRequest = slidingWindowStateRef.current.pendingTranslations.get(segmentId);
    
    if (originalRequest) {
      const requestToResponseLatency = currentTime - originalRequest.timestamp;
      const processingLatency = performance.now() - originalRequest.startTime;
      
      if (metricsSystemRef.current) {
        metricsSystemRef.current.recordTranslation(
          originalRequest.wordCount,
          processingLatency
        );
      }
    
      console.log(`[${formattedTime}] [METRICS] Translation latency: ${processingLatency.toFixed(2)}ms for segment ${segmentId}, ${requestToResponseLatency}ms total`);
    }

    console.log(`[${formattedTime}] [SLIDING_WINDOW] Received translation segment ${segmentId} (${startWord}-${endWord}): "${translation.substring(0, 40)}${translation.length > 40 ? '...' : ''}"`);
    
    slidingWindowBufferRef.current.segments.set(startWord, {
      id: segmentId,
      startPosition: startWord,
      endPosition: endWord, 
      translation: translation,
      timestamp: currentTime,
      isInterim: isInterim,
      processingTime: performance.now() - translationStart
    });

    const allSegments = Array.from(slidingWindowBufferRef.current.segments.entries())
      .sort((a, b) => a[0] - b[0]);
    
    let previousSegment = null;
    for (let i = allSegments.length - 1; i >= 0; i--) {
      const [prevStartPos, segmentData] = allSegments[i];
      if (prevStartPos < startWord && segmentData.id !== segmentId) {
        previousSegment = segmentData;
        break;
      }
    }

    if (previousSegment && previousSegment.endPosition > startWord) {
      const overlapSize = previousSegment.endPosition - startWord;
      
      console.log(`[OVERLAP_DETECTED] Between segments ${previousSegment.id} and ${segmentId}`);
      console.log(`  Overlap size: ${overlapSize} words`);
      console.log(`  Previous segment position: ${previousSegment.startPosition}-${previousSegment.endPosition}`);
      console.log(`  Current segment position: ${startWord}-${endWord}`);
      
      const prevWords = previousSegment.translation.split(/\s+/);
      const currWords = translation.split(/\s+/);
      
      const prevOverlap = prevWords.slice(-Math.min(overlapSize, prevWords.length)).join(' ');
      const currOverlap = currWords.slice(0, Math.min(overlapSize, currWords.length)).join(' ');
      
      console.log(`  Previous overlap text: "${prevOverlap}"`);
      console.log(`  Current overlap text: "${currOverlap}"`);
      
      const similarityScore = calculateSimilarityScore(prevOverlap, currOverlap);
      console.log(`  Similarity score: ${similarityScore.toFixed(2)}`);
      
      const stitchingStrategy = similarityScore > 0.7 ? "merge_at_overlap" : "append_with_separator";
      console.log(`  Stitching strategy: ${stitchingStrategy}`);
    }

    slidingWindowBufferRef.current.pendingChunks++;
    
    renderSlidingWindowTranslation();
    
    if (slidingWindowBufferRef.current.pendingChunks > 20) {
      cleanupOldSegments();
    }
  };

  const calculateSimilarityScore = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    const normalize = t => t.toLowerCase().replace(/[.,?!;:'"()]/g, '').trim();
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    if (!norm1 || !norm2) return 0;
    
    const words1 = norm1.split(/\s+/);
    const words2 = norm2.split(/\s+/);
    
    let matchCount = 0;
    const minLength = Math.min(words1.length, words2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (words1[i] === words2[i]) matchCount++;
    }
    
    return minLength > 0 ? matchCount / minLength : 0;
  };

  const renderSlidingWindowTranslation = () => {
    const renderStart = performance.now();
    const formattedTime = new Date().toISOString().split('T')[1].split('Z')[0];

    if (slidingWindowBufferRef.current.segments.size === 0) {
      return;
    }
    
    const sortedSegments = Array.from(slidingWindowBufferRef.current.segments.values())
      .sort((a, b) => a.startPosition - b.startPosition);
    
    const currentTime = Date.now();
    
    if (sortedSegments.length === 1) {
      if (sortedSegments[0].translation !== slidingWindowBufferRef.current.lastDisplayed) {
        setTranscription(sortedSegments[0].translation);
        slidingWindowBufferRef.current.lastDisplayed = sortedSegments[0].translation;
        
        const renderTime = performance.now() - renderStart;
        if (metricsSystemRef.current) {
          metricsSystemRef.current.recordRender(renderTime);
        }
        
        console.log(`[${formattedTime}] [SLIDING_WINDOW] Rendered single segment in ${renderTime.toFixed(2)}ms`);
      }
      return;
    }

    let stitchedTranslation = sortedSegments[0].translation;
    let lastEndPosition = sortedSegments[0].endPosition;
    
    for (let i = 1; i < sortedSegments.length; i++) {
      const segment = sortedSegments[i];
      
      if (segment.endPosition <= lastEndPosition) {
        continue;
      }
      
      const segmentAge = currentTime - segment.timestamp;
      if (segmentAge < 100 && !sortedSegments[i].isInterim) {
        continue;
      }
      
      if (segment.startPosition < lastEndPosition) {
        const overlapCount = lastEndPosition - segment.startPosition;
        stitchedTranslation = stitchTranslations(
          stitchedTranslation,
          segment.translation,
          overlapCount
        );
      } else {
        stitchedTranslation += ' ' + segment.translation;
      }
      
      lastEndPosition = Math.max(lastEndPosition, segment.endPosition);
    }
    
    if (stitchedTranslation !== slidingWindowBufferRef.current.lastDisplayed) {
      setTranscription(stitchedTranslation);
      slidingWindowBufferRef.current.lastDisplayed = stitchedTranslation;
      slidingWindowBufferRef.current.pendingChunks = 0;

      const renderTime = performance.now() - renderStart;
      if (metricsSystemRef.current) {
        metricsSystemRef.current.recordRender(renderTime);
      }
      
      console.log(`[${formattedTime}] [SLIDING_WINDOW] Rendered ${sortedSegments.length} segments in ${renderTime.toFixed(2)}ms`);
    }
  };

  const cleanupOldSegments = () => {
    const currentTime = Date.now();
    const MAX_AGE_MS = 10000;
    
    for (const [startPosition, segment] of slidingWindowBufferRef.current.segments.entries()) {
      if (currentTime - segment.timestamp > MAX_AGE_MS) {
        slidingWindowBufferRef.current.segments.delete(startPosition);
      }
    }
    
    slidingWindowBufferRef.current.pendingChunks = Math.min(
      slidingWindowBufferRef.current.pendingChunks, 
      slidingWindowBufferRef.current.segments.size
    );
    
    console.log(`[SLIDING_WINDOW] Cleaned up old segments. ${slidingWindowBufferRef.current.segments.size} segments remaining.`);
  };

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
      segmentStartTimeRef.current = Date.now();
      retriesRef.current = 0;
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        const delay = Math.min(50 * Math.pow(2, retriesRef.current), 2000);
        retriesRef.current++;

        setTimeout(() => {
          try {
            if (isRecording) {
              recognitionRef.current.start();
              console.log(`Recognition restarted after ${delay}ms delay`);
            }
          } catch (e) {
            console.error('Error restarting recognition:', e);
            if (retriesRef.current < 5) {
              setTimeout(() => {
                initializeSpeechRecognition();
                recognitionRef.current.start();
              }, 1000);
            } else {
              setError('Too many restart attempts. Please try again.');
              setIsRecording(false);
            }
          }
        }, delay);
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
      } else if (event.error === 'audio-capture' || event.error === 'not-allowed') {
        setError(`Microphone error: ${event.error}. Please check your microphone permissions.`);
        setIsRecording(false);
      } else {
        setError(`Recognition error: ${event.error}`);
      }
    };

    recognitionRef.current.onresult = handleRecognitionResult;
    return true;
  };

  const handleRecognitionResult = (event) => {
    const currentTime = Date.now();
    const formattedTime = new Date(currentTime).toISOString().split('T')[1].split('Z')[0];

    console.log(`[${formattedTime}] Recognition result received`);

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      const timeSinceLastSpeech = currentTime - lastSpeechTimestampRef.current;
      const segmentDuration = currentTime - segmentStartTimeRef.current;
      const isInterim = !event.results[i].isFinal;

      const wordCount = transcript.trim().split(/\s+/).length;
      const isLongEnough = wordCount >= SPEECH_CONFIG.WORD_COUNT_THRESHOLD;
      
      if (isInterim) {
        setTranscription(transcript + '...');
      } else {
        setTranscription(transcript);
      }

      if (SPEECH_CONFIG.USE_SLIDING_WINDOW) {
        processSlidingWindow(transcript, isInterim);
        
        if (timeSinceLastSpeech >= SPEECH_CONFIG.PAUSE_DURATION) {
          lastSpeechTimestampRef.current = currentTime;
        }
        
        if (!isInterim) {
          lastSpeechTimestampRef.current = currentTime;
          
          if (transcript.endsWith('.') || 
              transcript.endsWith('!') || 
              transcript.endsWith('?') ||
              timeSinceLastSpeech > SPEECH_CONFIG.PAUSE_DURATION ||
              isLongEnough) {
            
            let resetReason = '';
            if (transcript.endsWith('.') || transcript.endsWith('!') || transcript.endsWith('?')) 
              resetReason = 'punctuation';
            else if (timeSinceLastSpeech > SPEECH_CONFIG.PAUSE_DURATION)
              resetReason = `${SPEECH_CONFIG.PAUSE_DURATION}ms pause`;
            else if (isLongEnough)
              resetReason = `word count threshold (${wordCount} words)`;
            
            segmentStartTimeRef.current = currentTime;
            console.log(`[${formattedTime}] Segment reset: ${resetReason}`);
          }
        }
      } else {
        if (!isInterim) {
          sendTranslationRequest(transcript, true);
        } else if (isLongEnough || timeSinceLastSpeech >= SPEECH_CONFIG.PAUSE_DURATION) {
          sendTranslationRequest(transcript, false);
          lastSpeechTimestampRef.current = currentTime;
        }
      }
    }
  };

  const sendTranslationRequest = async (text, isFinal) => {
    if (!text.trim() || text.length < SPEECH_CONFIG.MIN_SPEECH_LENGTH) return;

    try {
      const response = await fetch('https://churchtranslator.com:4586/translate_realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          clientId: clientIdRef.current,
          isFinal,
          wordCountTriggered: text.split(' ').length >= SPEECH_CONFIG.WORD_COUNT_THRESHOLD
        })
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      if (!error.message.includes('Failed to fetch')) {
        setError('Translation error occurred: ' + error.message);
      }
    }
  };

  const initializeTranslationStream = () => {
    if (translationSourceRef.current) {
      translationSourceRef.current.close();
    }

    translationSourceRef.current = new EventSource(
     `https://churchtranslator.com:4586/stream_translation/pt?client_id=${clientIdRef.current}&role=broadcaster`
    );

    translationSourceRef.current.onmessage = (event) => {
      try {
        const responseTimestamp = Date.now();
        const data = JSON.parse(event.data);
        
        if (data.keepalive) return;
        
        if (!data.translation) return;
        
        if (data.slidingWindowInfo) {
          handleSlidingWindowTranslation(data);
        } else {
          setTranscription(data.translation);
        }
      } catch (error) {
        console.error('Error processing translation:', error);
      }
    };

    translationSourceRef.current.onerror = (error) => {
      console.error('Translation stream error:', error);
      if (isRecording) {
        setTimeout(() => {
          if (isRecording) {
            initializeTranslationStream();
          }
        }, 2000);
      }
    };
  };

  // Add sermon to the API (from 2nd code)
  const addSermon = async () => {
    try {
      const checkLiveResponse = await fetch(`${apiBaseUrl}/sermon/checkLive`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!checkLiveResponse.ok) {
        throw new Error('Failed to check live sermons');
      }

      const liveData = await checkLiveResponse.json();

      const churchId = localStorage.getItem('churchId') || '';
      const adminStaffUserId = localStorage.getItem('userId');

      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach((part) => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;
        return isoLike;
      };

      const startDateTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/sermon/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          churchId,
          adminStaffUserId,
          startDateTime,
          status: 'Live',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add sermon');
      }

      const data = await response.json();
      const sermonId = data.sermon && data.sermon._id;
      setCurrentSermonId(sermonId);
      localStorage.setItem('currentSermonId', sermonId);
      console.log('Sermon added successfully:', data);
      return true;
    } catch (error) {
      console.error('Error adding sermon:', error);
      setError('Error adding sermon: ' + error.message);
      return false;
    }
  };

  // Update sermon status to 'End' (from 2nd code)
  const updateSermonStatus = async (sermonId = currentSermonId) => {
    if (!sermonId) {
      console.warn('No sermon ID available to update');
      return;
    }

    try {
<<<<<<< HEAD
      const churchId = localStorage.getItem('churchId') || '66fbaf5bb02a5ffd85ca32f5';
      const adminStaffId = localStorage.getItem('adminStaffId') || '67b5d2ebe467df285f8c9d3b';
      const userId = localStorage.getItem('userId');

      const getCurrentIndianTime = () => {
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour24: false,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        const partsObj = {};

        parts.forEach((part) => {
          partsObj[part.type] = part.value;
        });

        const isoLike = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}.000+05:30`;
        return isoLike;
      };

      const endDateTime = getCurrentIndianTime();

      const response = await fetch(`${apiBaseUrl}/sermon/edit/${sermonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          churchId,
          adminStaffId,
          userId,
          endDateTime,
          status: 'End',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sermon status');
      }

      console.log('Sermon status updated to End');
      setCurrentSermonId(null);
      localStorage.removeItem('currentSermonId');
    } catch (error) {
      console.error('Error updating sermon status:', error);
      setError('Error updating sermon status: ' + error.message);
    }
  };

  useEffect(() => {
    const initializeMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput');
        await logMicrophoneDetails();

        setMicrophones(mics);
        
        if (mics.length === 0) {
          setError('No microphones found');
        } else {
          setError('');
          setSelectedMicrophoneId('');
        }

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

  // Check for active sermon on page refresh (from 2nd code)
  useEffect(() => {
    const storedSermonId = localStorage.getItem('currentSermonId');
    if (storedSermonId) {
      setCurrentSermonId(storedSermonId);
      updateSermonStatus(storedSermonId);
    }
  }, []);

  const startRecording = async () => {
    if (!isInitialized) {
      const initialized = initializeSpeechRecognition();
      if (!initialized) return;
      setIsInitialized(initialized);
    }

    try {
      // Reset sliding window state
      slidingWindowStateRef.current = {
        wordBuffer: [],
        lastTranslatedIndex: 0,
        pendingTranslations: new Map(),
        translationResponses: new Map(),
        segmentId: 0,
        lastTranslationTimestamp: Date.now()
      };
      
      slidingWindowBufferRef.current = {
        segments: new Map(),
        lastDisplayed: null,
        pendingChunks: 0,
        enabled: SPEECH_CONFIG.USE_SLIDING_WINDOW
      };

      // Run both APIs concurrently
      const startStreamPromise = fetch('https://churchtranslator.com:4586/start_stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceId: selectedMicrophoneId,
          deviceSettings: AUDIO_CONFIG,
          clientId: clientIdRef.current
        })
      }).then(response => {
        if (!response.ok) throw new Error('Failed to start stream');
        return response;
      });

      const addSermonPromise = addSermon();

      // Wait for both promises to resolve
      const [startStreamResponse, sermonAdded] = await Promise.all([
        startStreamPromise,
        addSermonPromise
      ]);

      if (!sermonAdded) {
        throw new Error('Failed to add sermon');
      }

      initializeTranslationStream();

      try {
        await recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
        const reinitialized = initializeSpeechRecognition();
        if (reinitialized) {
          try {
            await recognitionRef.current.start();
            setIsRecording(true);
          } catch (retryError) {
            throw new Error(`Failed to start recognition after retry: ${retryError.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Error starting stream: ' + error.message);
      setIsRecording(false);
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

      // Run both APIs concurrently
      const stopStreamPromise = fetch('https://churchtranslator.com:4586/stop_stream', {
        method: 'POST'
      }).then(response => {
        if (!response.ok) throw new Error('Failed to stop stream');
        return response;
      });

      const updateSermonPromise = updateSermonStatus();

      // Wait for both promises to resolve
      await Promise.all([stopStreamPromise, updateSermonPromise]);

      setStatus('Stopped');
      setTranscription('');
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Error stopping stream: ' + error.message);
    }
  };

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
=======
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
=======
  }, []);
>>>>>>> 9d8938c (latest code pushed to git)

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

<<<<<<< HEAD
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
                    wordBreak: 'break-word',
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
>>>>>>> c307fdc (New changes)
=======
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
>>>>>>> 9d8938c (latest code pushed to git)
  );
};

export default GoLive;
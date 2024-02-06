// Microphone.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRecordVoice } from "app/(speech)/hooks/useRecordVoice.js";
import { IconMicrophone } from "app/(speech)/app/components/IconMicrophone.js";
import TranscriptionContext from 'app/(speech)/app/components/TranscriptionContext.js';

const Microphone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const accumulatedFinalTranscript = useRef("");
  const { setLiveTranscription, setFinalTranscription } = useContext(TranscriptionContext);
  const recognitionActive = useRef(false);

  const { startRecording, stopRecording } = useRecordVoice(setFinalTranscription);

  const recognition = typeof window !== 'undefined' ? new (window.webkitSpeechRecognition || window.SpeechRecognition)() : null;

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    recognitionActive.current = !isRecording;
    if (!isRecording) {
      accumulatedFinalTranscript.current = "";
      if (recognition) {
        recognition.start();
        startRecording();
      }
    } else {
      if (recognition) {
        recognition.abort();
        stopRecording();
        setLiveTranscription("");
      }
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-MX';

      recognition.onresult = (event) => {
        if (!recognitionActive.current) return;

        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            accumulatedFinalTranscript.current += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setLiveTranscription(accumulatedFinalTranscript.current + interimTranscript);
      };

      recognition.onend = () => {
        console.log("Recognition service has ended");
      };
    }
  }, [recognition]);


  // Your existing button style logic
  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px', // Increased size for visibility
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isRecording ? '#ef4444' : '#1E293B',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Added shadow for depth
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    zIndex: 1000,
    animation: isRecording ? 'pulse 1s infinite' : 'gentlePulse 2s infinite', // Apply animation based on state
  };
  return (
    <>
     <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes gentlePulse {
            0% { transform: translateX(-50%) scale(1); opacity: 1; }
            50% { transform: translateX(-50%) scale(1.05); opacity: 0.9; }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
          }
        `}
      </style>
      <div style={buttonStyle} onClick={toggleRecording}>
        <IconMicrophone />
      </div>
            {/*<div className="live-transcription-output">
        <p>{accumulatedFinalTranscript.current}</p>
      </div>*/}
    </>
  );
};
export { Microphone };
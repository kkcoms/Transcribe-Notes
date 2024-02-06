// LiveTranscriptionMicrophone.tsx
"use client";
import React, { useState, useEffect, useContext, useRef } from 'react';
import TranscriptionContext from './TranscriptionContext';
import EditorJS from '@editorjs/editorjs';

const LiveTranscriptionMicrophone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const accumulatedFinalTranscript = useRef(""); // Ref to keep track of the accumulated final transcript
  const { setTranscription } = useContext(TranscriptionContext);
  const editorRef = useRef<EditorJS>(null);

  // Initialize webkitSpeechRecognition only if running in the browser
  const recognition = typeof window !== 'undefined' ? new (window.webkitSpeechRecognition || window.SpeechRecognition)() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-MX';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            accumulatedFinalTranscript.current += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = accumulatedFinalTranscript.current + interimTranscript;
        setTranscription(currentTranscript);

        if (editorRef.current) {
          editorRef.current.blocks.insert('paragraph', { text: currentTranscript }, {}, 0, true);
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart recognition if still recording
        }
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isRecording, recognition]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      accumulatedFinalTranscript.current = ""; // Clear the accumulated transcript
      if (recognition) {
        recognition.start();
      }
    } else {
      if (recognition) {
        recognition.stop();
      }
    }
  };

  return (
    <>
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Transcription' : 'Start Transcription'}
      </button>
      <div className="live-transcription-output">
        {/* Render the live transcription as it happens */}
        <p>{accumulatedFinalTranscript.current}</p>
      </div>
    </>
  );
};

export default LiveTranscriptionMicrophone;

// Microphone.tsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRecordVoice } from "@/app/(speech)/hooks/useRecordVoice";
import { IconMicrophone } from "@/app/(speech)/app/components/IconMicrophone";
import TranscriptionContext from "./TranscriptionContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';


declare global {
  interface Window {
      webkitSpeechRecognition: any;
      SpeechRecognition: any;
  }
}

interface MicrophoneProps {
  documentId?: string; // Assuming documentId is a string. Adjust the type as necessary.
}
const Microphone: React.FC<MicrophoneProps> = ({ documentId }) => {
  const [summarizationResult, setSummarizationResult] = useState("");
  const saveSummarizationResult = useMutation(api.documents.saveSummarizationResult);

  // Assuming you have a query defined in your Convex functions to fetch the summarization result
  const fetchedSummarizationResult = useQuery(api.documents.getSummarizationResult, documentId ? { id: documentId as Id<"documents"> } : "skip");

  useEffect(() => {
    if (fetchedSummarizationResult) {
      // Process or set the fetched summarization result as needed
      setSummarizationResult(fetchedSummarizationResult);
    }
  }, [fetchedSummarizationResult]);

  
  const [isRecording, setIsRecording] = useState(false);
  const accumulatedFinalTranscript = useRef("");
  const { setLiveTranscription, setFinalTranscription, generateNewSessionId } = useContext(TranscriptionContext);
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
        generateNewSessionId(); // Generate a new session ID for each new recording
        startRecording();
        setFinalTranscription(""); // Clear the final transcription
      }
    } else {
      if (recognition) {
        recognition.abort();
        stopRecording();
        setLiveTranscription("");
        sendTranscriptionForSummarization(accumulatedFinalTranscript.current); // Trigger API call
        setFinalTranscription(""); // Clear the final transcription
      }
    }
  };

  const sendTranscriptionForSummarization = async (finalTranscription: string) => {
    // Assuming documentId is accessible in this scope as a prop
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ content: finalTranscription }] }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Summarization result:', data);
      setSummarizationResult(data); // Update the summarization result
      saveSummarizationResult({ id: documentId as Id<"documents">, summarizationResult: data.data });
    } catch (error) {
      console.error('Error sending transcription for summarization:', error);
    }
  };
  

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-Mx';

      recognition.onresult = (event: any) => {
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
  const buttonStyle: React.CSSProperties = {
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
      <div dangerouslySetInnerHTML={{ __html: fetchedSummarizationResult || '' }} />

      
      {/*<div className="live-transcription-output">
        <p>{accumulatedFinalTranscript.current}</p>
      </div>*/}
    </>
  );
};

export { Microphone };



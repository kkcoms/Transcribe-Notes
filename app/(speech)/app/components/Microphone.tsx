// Microphone.tsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRecordVoice } from "@/app/(speech)/hooks/useRecordVoice";
import { IconMicrophone } from "@/app/(speech)/app/components/IconMicrophone";
import TranscriptionContext from "./TranscriptionContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import SummarizationComponent from "./SummarizationComponent";



declare global {
  interface Window {
      webkitSpeechRecognition: any;
      SpeechRecognition: any;
  }
}

interface MicrophoneProps {
  documentId: Id<"documents">;
  // Assuming documentId is a string. Adjust the type as necessary.
}
const Microphone: React.FC<MicrophoneProps> = ({ documentId }) => {
  const [, setSummarizationResult] = useState("");

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
  const { finalTranscription, setLiveTranscription, setFinalTranscription, generateNewSessionId } = useContext(TranscriptionContext);
  const recognitionActive = useRef(false);

  const { startRecording, stopRecording } = useRecordVoice(documentId,setFinalTranscription);
  

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
        setFinalTranscription(""); // Clear the final transcription
      }
    }
  };
  



  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-MX';

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

  const buttonClass = `fixed bottom-16 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer z-50 ${
    isRecording ? 'animate-smooth-pulse bg-red-500' : 'animate-smooth-gentlePulse bg-slate-800 dark:bg-slate-600'
  }`;

  
  

  // const buttonStyle: React.CSSProperties = {
  //   position: 'fixed',
  //   bottom: '100px',
  //   left: '50%',
  //   transform: 'translateX(-50%)',
  //   width: '80px', // Increased size for visibility
  //   height: '80px',
  //   borderRadius: '50%',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: isRecording ? '#ef4444' : '#1E293B',
  //   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Added shadow for depth
  //   transition: 'all 0.3s ease-in-out',
  //   cursor: 'pointer',
  //   zIndex: 1000,
  //   animation: isRecording ? 'pulse 1s infinite' : 'gentlePulse 2s infinite', // Apply animation based on state
  // };

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
          },

          .visuallyHidden {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
        `}
      </style>
      <button className={buttonClass} onClick={toggleRecording}>
        <IconMicrophone />
      </button>
 <div className="visuallyHidden">
        <SummarizationComponent documentId={documentId} finalTranscription={finalTranscription} />
      </div>
      {/*<div className="live-transcription-output">
        <p>{accumulatedFinalTranscript.current}</p>
      </div>*/}
    </>
  );
};

export { Microphone };



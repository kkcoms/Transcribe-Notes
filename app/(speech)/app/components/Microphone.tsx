// Microphone.tsx
"use client";

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRecordVoice } from "@/app/(speech)/hooks/useRecordVoice";
import { IconMicrophone } from "@/app/(speech)/app/components/IconMicrophone";
import TranscriptionContext from '@/app/(speech)/app/components/TranscriptionContext';


export default function Microphone(){
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
        setFinalTranscription(""); // Clear the final transcription        
      }
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

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

  return (
      <>
          <div
              className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center ${
                  isRecording
                      ? "bg-red-500 animate-pulse"
                      : "bg-blue-800 animate-gentlePulse"
              } shadow-md transition-all duration-300 ease-in-out cursor-pointer z-10`}
              onClick={toggleRecording}
          >
              <IconMicrophone className={`h-6 w-6 text-gray-700`} />
          </div>
          <div className="live-transcription-output">
              <p>{accumulatedFinalTranscript.current}</p>
          </div>
      </>
  );

};
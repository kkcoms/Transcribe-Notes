// EditorWrapper.js
"use client";
import React, { useState } from 'react';
import { Microphone } from 'app/(speech)/app/components/Microphone.js';
import TranscriptionContext from 'app/(speech)/app/components/TranscriptionContext.js';
import LiveTranscriptionMicrophone from 'app/(speech)/app/components/LiveTranscription.tsx';


const EditorWrapper = ({ post }) => {
  const [transcription, setTranscription] = useState('');

  console.log('EditorWrapper.js:', 'Initializing EditorWrapper');

  return (
    <TranscriptionContext.Provider value={{ transcription, setTranscription }}>
      <Microphone /> 
      {/*<LiveTranscriptionMicrophone /> */} 
    </TranscriptionContext.Provider>
  );
};

export default EditorWrapper;

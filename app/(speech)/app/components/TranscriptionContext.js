// TranscriptionContext.js
import React, { useState, createContext } from 'react';

// Create a context with separate states for live and final transcriptions
const TranscriptionContext = createContext({
  liveTranscription: '',
  setLiveTranscription: () => {},
  finalTranscription: '',
  setFinalTranscription: () => {}
});

export const TranscriptionProvider = ({ children }) => {
  const [liveTranscription, setLiveTranscription] = useState('');
  const [finalTranscription, setFinalTranscription] = useState('');

  // The value provided to the context consumers
  const contextValue = {
    liveTranscription,
    setLiveTranscription,
    finalTranscription,
    setFinalTranscription
  };

  return (
    <TranscriptionContext.Provider value={contextValue}>
      <Microphone /> 
    </TranscriptionContext.Provider>
  );
};

export default TranscriptionContext;

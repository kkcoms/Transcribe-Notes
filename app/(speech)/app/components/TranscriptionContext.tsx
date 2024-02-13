import React, { createContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TranscriptionContextType {
  liveTranscription: string;
  setLiveTranscription: (transcription: string) => void;
  finalTranscription: string;
  setFinalTranscription: (transcription: string) => void;
  generateNewSessionId: () => void;
  currentSessionId: string;
}

const defaultState: TranscriptionContextType = {
  liveTranscription: '',
  setLiveTranscription: () => {},
  finalTranscription: '',
  setFinalTranscription: () => {},
  generateNewSessionId: () => {},
  currentSessionId: '',
};

const TranscriptionContext = createContext<TranscriptionContextType>(defaultState);

export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [liveTranscription, setLiveTranscription] = useState('');
  const [finalTranscription, setFinalTranscription] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');

  const generateNewSessionId = () => {
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
  };

  const contextValue = {
    liveTranscription,
    setLiveTranscription,
    finalTranscription,
    setFinalTranscription,
    generateNewSessionId,
    currentSessionId,
  };

  return (
    <TranscriptionContext.Provider value={contextValue}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export default TranscriptionContext;

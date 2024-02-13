// EditorWrapper.js
"use client";
import React from 'react';
import { Microphone } from 'app/(speech)/app/components/Microphone.js';

const EditorWrapper = ({ post }) => {
  console.log('EditorWrapper.js:', 'Initializing EditorWrapper');

  // No TranscriptionContext.Provider should be here since you already have TranscriptionProvider at the root level
  return (
    <>
      <Microphone /> 
      {/* Other components that depend on TranscriptionContext can be here */}
    </>
  );
};

export default EditorWrapper;

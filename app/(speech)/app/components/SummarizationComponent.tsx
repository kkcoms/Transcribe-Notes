// SummarizationComponent.tsx
import React, { useState, useEffect } from 'react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import TranscriptionContext from "./TranscriptionContext";

interface SummarizationComponentProps {
  documentId?: string;
  finalTranscription: string;
}

const SummarizationComponent: React.FC<SummarizationComponentProps> = ({ documentId, finalTranscription }) => {
  const [summarizationResult, setSummarizationResult] = useState("");
  const saveSummarizationResult = useMutation(api.documents.saveSummarizationResult);

  useEffect(() => {
    const sendTranscriptionForSummarization = async () => {
      if (finalTranscription.trim().length > 0) {
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
          if (documentId) {
            saveSummarizationResult({ id: documentId as Id<"documents">, summarizationResult: data.data });
          }
        } catch (error) {
          console.error('Error sending transcription for summarization:', error);
        }
      }
    };

    sendTranscriptionForSummarization();
  }, [finalTranscription, documentId]);
  
  console.log("Summarization result:", summarizationResult);
  return (
    <div  />
  );
};

export default SummarizationComponent;

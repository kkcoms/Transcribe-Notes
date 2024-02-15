import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';

interface SummarizationProps {
  documentId: Id<"documents">;
  transcript: string; // Pass the transcript if the summarization needs it
}

const Summarization: React.FC<SummarizationProps> = ({ documentId, transcript }) => {
  const [summarizationResult, setSummarizationResult] = useState("");
  const saveSummarizationResult = useMutation(api.documents.saveSummarizationResult);

  // Assuming you have a query defined in your Convex functions to fetch the summarization result
  const fetchedSummarizationResult = useQuery(api.documents.getSummarizationResult, documentId ? { id: documentId } : "skip");

  useEffect(() => {
    if (fetchedSummarizationResult) {
      // Process or set the fetched summarization result as needed
      setSummarizationResult(fetchedSummarizationResult);
    }
  }, [fetchedSummarizationResult]);

  // Optionally, you can move the sendTranscriptionForSummarization logic here
  // This depends on whether you want to trigger summarization from this component
  // or just display the result of summarization triggered elsewhere

  return (
    <div dangerouslySetInnerHTML={{ __html: summarizationResult || '' }} />
  );
};

export default Summarization;

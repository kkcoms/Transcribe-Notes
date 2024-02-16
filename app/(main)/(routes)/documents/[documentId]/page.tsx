// page.tsx
"use client";

// Make sure all import statements are at the top of the file
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useContext, useMemo, useState } from "react";
import { TranscriptionProvider } from "@/app/(speech)/app/components/TranscriptionContext"; // This is the corrected import path
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from '@/components/editor'; // Import Editor here as well, if needed
import { Microphone } from '@/app/(speech)/app/components/Microphone';
import SummarizationComponent from "@/app/(speech)/app/components/SummarizationComponent";
import TranscriptionContext from "@/app/(speech)/app/components/TranscriptionContext"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const {finalTranscription} = useContext(TranscriptionContext);

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content
    });
  };
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <TranscriptionProvider>
      <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar initialData={document} />
          <Editor
            onChange={onChange}
            initialContent={document.content}
          />
          
          <Microphone documentId={params.documentId} />


        </div>
      </div>
    </TranscriptionProvider>
  );
};

export default DocumentIdPage;
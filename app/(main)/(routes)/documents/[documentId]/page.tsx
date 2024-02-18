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
import { Microphone } from '@/app/(speech)/app/components/Microphone';
import SummarizationComponent from "@/app/(speech)/app/components/SummarizationComponent";
import TranscriptionContext from "@/app/(speech)/app/components/TranscriptionContext";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
    
  };
}

const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { finalTranscription } = useContext(TranscriptionContext);
  const fetchedSummarizationResult = useQuery(api.documents.getSummarizationResult, params.documentId ? { id: params.documentId as Id<"documents"> } : "skip");

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
    return <div>Document not found.</div>;
  }

  // return (
  //   <TranscriptionProvider>
  //     <div className="pb-40">
  //     <Cover url={document.coverImage} />
  //       <div className="mx-auto max-w-7xl px-4 lg:px-8">
  //       <Toolbar initialData={document} />
  
  //         <button
  //           className="lg:hidden" // This button is only visible on small screens
  //           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  //         >
  //           {/* Icon or label for the button */}
  //           {isSidebarOpen ? 'Close' : 'Summary'}
  //         </button>
  //         <div className="flex flex-col lg:flex-row gap-x-8">
  //           <div className="flex-1 lg:flex-3/4 p-4 order-2 lg:order-1"> {/* Main content */}
  //           <Editor
  //                 onChange={onChange}
  //                 initialContent={document.content}
  //               />
  //               <Microphone documentId={params.documentId} />
  //           </div>
  //           <div
  //             className={`w-full lg:w-1/4 p-4 order-1 lg:order-2 ${
  //               isSidebarOpen ? 'block' : 'hidden'
  //             } lg:block`} // Control visibility on small screens
  //           >
  //             <div className="sticky top-20 text-lg lg:text-xl">
  //               {/* Summary content */}
  //               <div dangerouslySetInnerHTML={{ __html: fetchedSummarizationResult || '' }} />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </TranscriptionProvider>
  // );
  
  
  return (
    <TranscriptionProvider>
      <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Toolbar initialData={document} />
          <div className="flex flex-col-reverse lg:flex-row gap-x-8">
            <div className="lg:w-3/4 p-4"> {/* Main content */}
              <Editor
                onChange={onChange}
                initialContent={document.content}
              />
              <Microphone documentId={params.documentId} />
            </div>
            <div className=" p-4 lg:sticky lg:top-20 lg:w-1/4"> {/* Sidebar summary */}
              <div className="sticky top-20 text-lg lg:text-xl">
                {/* Summary content */}
                <div dangerouslySetInnerHTML={{ __html: fetchedSummarizationResult || '' }} />

                <div className="mx-auto max-w-7xl px-4 lg:px-8">
  {/* Existing content */}
  {document.audioFileRef && (
    <audio controls src={document.audioFileUrl    }>
      Your browser does not support the audio tag.
    </audio>
  )}
  {/* Other content */}
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </TranscriptionProvider>
  );
  };
  
  export default DocumentIdPage;



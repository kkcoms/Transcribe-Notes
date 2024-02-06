// editor.tsx
"use client";
import React, { useContext, useEffect } from 'react';
import EditorWrapper from 'app/(speech)/app/components/EditorWrapper.js';
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import TranscriptionContext from 'app/(speech)/app/components/TranscriptionContext.js';

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const { liveTranscription, finalTranscription } = useContext(TranscriptionContext);

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: async (file: File) => {
      const response = await edgestore.publicFiles.upload({ file });
      return response.url;
    }
  });

  useEffect(() => {
    // Choose what to display in the editor: final transcription if available, otherwise live transcription
    const contentToShow = finalTranscription || liveTranscription;
    if (contentToShow && editor.setContent) {
      // Assuming 'editor.setContent' is a method to set the editor's content
      editor.setContent(contentToShow);
    }
  }, [liveTranscription, finalTranscription, editor]);

  return (
    <div>
      <BlockNoteView editor={editor} theme={resolvedTheme === "dark" ? "dark" : "light"} />
      <EditorWrapper />
    </div>
  );
};

export default Editor;

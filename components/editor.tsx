// This is the editor component that is used in the app. It uses the BlockNoteEditor and BlockNoteView components from the @blocknote/core and @blocknote/react packages.
//editor.tsx
"use client";
import React, { useEffect, useContext } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore";
// import Microphone from "@/app/(speech)/app/components/Microphone";
import TranscriptionContext from "@/app/(speech)/app/components/TranscriptionContext";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/clerk-react";
// import { WebrtcProvider } from "y-webrtc";
// import * as Y from "yjs";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export default function Editor ({ onChange, initialContent, editable }: EditorProps){
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();
    // const doc = new Y.Doc();
    // const provider = new WebrtcProvider("notes", doc);
    const { user } = useUser();
    // console.log("resolvedTheme:", resolvedTheme);
    // console.log("edgestore:", edgestore);
    // console.log("liveTranscription:", liveTranscription);
    // console.log("finalTranscription:", finalTranscription);
    // console.log("currentSessionId:", currentSessionId);
    const {caption} = useContext(TranscriptionContext);
    const currentSessionId = uuidv4();

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : undefined,
        onEditorContentChange: (editor) => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        },
        uploadFile: async (file: File) => {
            const response = await edgestore.publicFiles.upload({ file });
            return response.url;
        },
        // collaboration: {
        //     provider,
        //     fragment: doc.getXmlFragment("document-store"),
        //     user: {
        //         name: user?.fullName as string,
        //         color: "#ff0000",
        //     },
        // },
    });
    useEffect(() => {
        const transcriptionBlockId = `transcription-${currentSessionId}`;

        if (editor) {
            const blockExists = editor.getBlock(transcriptionBlockId);

            if (caption) {
                // If caption is available and the block exists, update it
                if (blockExists) {
                    editor.updateBlock(transcriptionBlockId, {
                        content: caption,
                    });
                } else {
                    // If the block doesn't exist yet, create it with caption
                    const newBlock: PartialBlock = {
                        id: transcriptionBlockId,
                        type: "paragraph",
                        content: caption,
                    };
                    editor.insertBlocks(
                        [newBlock],
                        editor.topLevelBlocks[editor.topLevelBlocks.length - 1],
                        "after"
                    );
                }
            }
        }
    }, [editor, currentSessionId]);

    console.log("caption:", caption);

    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
        </div>
    );
};

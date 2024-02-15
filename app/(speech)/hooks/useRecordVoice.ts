//useRecordVoice.ts
//useRecordVoice.ts
"use client";

import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/app/(speech)/utils/blobToBase64";
import { createMediaStream } from "@/app/(speech)/utils/createMediaStream";

export const useRecordVoice = (onTranscriptionComplete: any) => {
    const [text, setText] = useState("");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [recording, setRecording] = useState(false);
    const isRecording = useRef(false);
    const chunks = useRef<Blob[]>([]);

    const startRecording = () => {
        if (mediaRecorder) {
            isRecording.current = true;
            mediaRecorder.start();
            setRecording(true);
            console.log("useRecordVoice.js - Recording started");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            isRecording.current = false;
            mediaRecorder.stop();
            setRecording(false);
            console.log("useRecordVoice.js - Recording stopped");
        }
    };

    const getText = async (base64data: any) => {
        try {
            const response = await fetch("/api/speechToText", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ audio: base64data }),
            }).then((res) => res.json());

            const { text } = response;
            setText(text);
            console.log("useRecordVoice.js - Text received:", text);

            // Call the callback function when the transcription is complete
            if (onTranscriptionComplete) {
                onTranscriptionComplete(text);
            }
        } catch (error) {
            console.error("Error in transcription:", error);
        }
    };

    const initialMediaRecorder = (stream: any) => {
        const mediaRecorder = new MediaRecorder(stream);
        let isRecording = false;
        // const callback = (peak: number) => {};

        mediaRecorder.onstart = () => {
            isRecording = true;
            createMediaStream(stream, isRecording, (peak: number) => {});
            chunks.current = [];
            console.log("useRecordVoice.js - MediaRecorder started");
        };

        mediaRecorder.ondataavailable = (ev) => {
            chunks.current.push(ev.data);
        };

        mediaRecorder.onstop = () => {
            isRecording = false;
            const audioBlob = new Blob(chunks.current, { type: "audio/mp3" });
            blobToBase64(audioBlob, getText);
            console.log("useRecordVoice.js - MediaRecorder stopped");
        };

        setMediaRecorder(mediaRecorder);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(initialMediaRecorder)
                .catch((error) => console.error("MediaDevices Error:", error));
        }
    }, []);

    return { recording, startRecording, stopRecording, text };
};
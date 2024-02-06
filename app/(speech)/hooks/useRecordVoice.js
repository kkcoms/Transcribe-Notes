//useRecordVoice.js
"use client";

import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "app/(speech)/utils/blobToBase64.js";
import { createMediaStream } from "app/(speech)/utils/createMediaStream.js";

export const useRecordVoice = (onTranscriptionComplete) => {
  const [text, setText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const isRecording = useRef(false);
  const chunks = useRef([]);

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

  const getText = async (base64data) => {
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

  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      createMediaStream(stream);
      chunks.current = [];
      console.log("useRecordVoice.js - MediaRecorder started");
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      blobToBase64(audioBlob, getText);
      console.log("useRecordVoice.js - MediaRecorder stopped");
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(initialMediaRecorder)
                            .catch((error) => console.error("MediaDevices Error:", error));
    }
  }, []);

  return { recording, startRecording, stopRecording, text };
};

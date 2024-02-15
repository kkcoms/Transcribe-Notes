"use client";

import {
    LiveClient,
    LiveTranscriptionEvents,
    createClient,
} from "@deepgram/sdk";
import { useState, useEffect, useCallback, useContext } from "react";
import { useQueue } from "@uidotdev/usehooks";
import { IconMicrophone } from "@/app/(speech)/app/components/IconMicrophone";
import TranscriptionContext from "./TranscriptionContext";
import { Toaster, toast } from "sonner";

export default function Microphone() {
    const { add, remove, first, size, queue } = useQueue<any>([]);
    const [connection, setConnection] = useState<LiveClient | null>();
    const [isListening, setListening] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isProcessing, setProcessing] = useState(false);
    const [micOpen, setMicOpen] = useState(false);
    const [microphone, setMicrophone] = useState<MediaRecorder | null>();
    const [userMedia, setUserMedia] = useState<MediaStream | null>();
    // const [caption, setCaption] = useState<string | null>();
    const { setCaption } = useContext(TranscriptionContext);

    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

    const toggleRecording = useCallback(async () => {
        if (microphone && userMedia) {
            setUserMedia(null);
            setMicrophone(null);

            microphone.stop();
        } else {
            const userMedia = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const microphone = new MediaRecorder(userMedia);
            microphone.start(500);

            microphone.onstart = () => {
                setMicOpen(true);
            };

            microphone.onstop = () => {
                setMicOpen(false);
            };

            microphone.ondataavailable = (e) => {
                add(e.data);
            };

            setUserMedia(userMedia);
            setMicrophone(microphone);
        }
    }, [add, microphone, userMedia]);

    useEffect(() => {
        if (apiKey) {
            console.log("connecting...");
            const deepgram = createClient(apiKey);
            const connection = deepgram.listen.live({
                model: "nova-2",
                interim_results: true,
                smart_format: true,
            });

            connection.on(LiveTranscriptionEvents.Open, () => {
                toast.success("Connection established");
                console.log("Connection established");
                setListening(true);
            });

            connection.on(LiveTranscriptionEvents.Close, () => {
              toast.warning("Connection closed!");
                console.log("Connection closed");
                setListening(false);
                setConnection(null);
            });

            connection.on(LiveTranscriptionEvents.Transcript, (data) => {
                const words = data.channel.alternatives[0].words;
                const newCaption = words
                    .map((word: any) => word.punctuated_word ?? word.word)
                    .join(" ");
                if (newCaption !== "" && newCaption.includes(".")) {
                    setCaption(newCaption);
                }
            });


            setConnection(connection);
            setLoading(false);
        }
    }, [apiKey]);

    useEffect(() => {
        const processQueue = async () => {
            if (size > 0 && !isProcessing) {
                setProcessing(true);

                if (isListening) {
                    const blob = first;
                    connection?.send(blob);
                    remove();
                }

                const waiting = setTimeout(() => {
                    clearTimeout(waiting);
                    setProcessing(false);
                }, 250);
            }
        };

        processQueue();
    }, [connection, queue, remove, first, size, isProcessing, isListening]);

    console.log("isListening:", isListening);
    console.log("isLoading:", isLoading);
    console.log("isProcessing:", isProcessing);
    console.log("micOpen:", micOpen);
    

    return (
        <div className="w-full relative">
            <div className="mt-10 flex flex-col align-middle items-center">
                <Toaster richColors closeButton />
                <button
                    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center ${
                        !!userMedia && !!microphone && micOpen
                            ? "bg-red-500 animate-pulse"
                            : "bg-blue-800 animate-gentlePulse"
                    } shadow-md transition-all duration-300 ease-in-out cursor-pointer z-10`}
                    onClick={() => toggleRecording()}
                >
                    <IconMicrophone className={`h-6 w-6 text-gray-700`} />
                </button>
                
            </div>
        </div>
    );
}

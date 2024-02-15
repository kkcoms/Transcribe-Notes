import React, { createContext, useState, ReactNode } from "react";

interface TranscriptionContextType {
    caption: string;
    setCaption: (caption: string) => void;
}

const defaultState: TranscriptionContextType = {
    caption: "",
    setCaption: () => {},
};

const TranscriptionContext =
    createContext<TranscriptionContextType>(defaultState);

export const TranscriptionProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [caption, setCaption] = useState("");

    const contextValue = {
        caption,
        setCaption,
    };

    return (
        <TranscriptionContext.Provider value={contextValue}>
            {children}
        </TranscriptionContext.Provider>
    );
};

export default TranscriptionContext;

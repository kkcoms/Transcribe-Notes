import React, { useState } from "react";
import Microphone from "@/app/(speech)/app/components/Microphone";
import Editor from "./Editor";

const EditorParent = () => {
    const [caption, setCaption] = useState("");

    return (
        <div>
            <Microphone setCaption={setCaption} />
            <Editor caption={caption} />
        </div>
    );
};

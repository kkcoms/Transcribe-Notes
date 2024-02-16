import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const base64Audio = body.audio;
  const audio = Buffer.from(base64Audio, "base64");
  
  // Use the /tmp directory for temporary storage
  const filePath = `/tmp/input.mp3`;

  try {
    fs.writeFileSync(filePath, audio);
    console.log("Audio file written to:", filePath);

    const readStream = fs.createReadStream(filePath);
    console.log("Read stream created for file:", filePath);

    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
    });
    console.log("Transcription data:", data);

    // Remove the file after use
    fs.unlinkSync(filePath);
    console.log("File removed:", filePath);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    // Return a proper error response with a status code
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}

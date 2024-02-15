import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { env } from "app/(speech)/app/config/env";

dotenv.config();

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const base64Audio = body.audio;
  const audio = Buffer.from(base64Audio, "base64");
  
  // Create a directory path for the tmp directory
  const tmpDir = path.join(process.cwd(), 'tmp');
  
  // Create the tmp directory if it does not exist
  if (!fs.existsSync(tmpDir)){
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  const filePath = path.join(tmpDir, 'input.mp3');

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

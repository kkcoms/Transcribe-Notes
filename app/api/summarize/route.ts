import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Updated configuration style for Edge functions
export const runtime = "experimental-edge";


export async function POST(req: NextRequest) {
  try {
    console.log("Received request for /api/summarize");

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("The messages array is empty or not properly formatted.");
    }

    const lastUserMessage = messages[messages.length - 1];

    if (typeof lastUserMessage.content !== 'string' || lastUserMessage.content.trim() === '') {
      throw new Error("The last message content is empty or not a string.");
    }

    const systemAndUserMessage = [
      {
        role: "system",
        content: `Title the summary with an <h1> tag and provide a brief summary of the user's message, focusing on the main points and action items. 
        Then, follow this with a detailed breakdown structured in HTML. 
        The detailed summary should be well-structured using HTML tags such as <h1>, <h2>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <img>, and <br> for line breaks. 
        Use classes for styling like 'class="text-3xl font-bold"' for headers, and 'class="space-y-4"' to space out elements. 
        Keep the summary concise, informative, and remember to maintain the original language of the user's message.
        For example, if the message is in Spanish, the response should also be in Spanish.
        Here’s an example of the structure in HTML, including line breaks and styling: 
        <div class="max-w-3xl space-y-4">
          <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold">Main Heading</h1>
          <h2 class="text-base sm:text-xl md:text-2xl font-medium">
            Subheading<br /><br />
            Additional content here.
          </h2>
        </div>
        Adapt the content structure to match the user's original message and format it accordingly in HTML. Ensure that line breaks (<br />) are used to create space between elements where necessary.`,
      },
      {
        role: "user",
        content: lastUserMessage.content,
      },
    ];
    

    console.log("Sending to OpenAI:", systemAndUserMessage);

    

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: `Title the summary with an <h1> tag and provide a brief summary of the user's message, focusing on the main points and action items. 
          Then, follow this with a detailed breakdown structured in HTML. 
          The detailed summary should be well-structured using HTML tags such as <h1>, <h2>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <img>, and <br> for line breaks. 
          Use classes for styling like 'class="text-3xl font-bold"' for headers, and 'class="space-y-4"' to space out elements. 
          Keep the summary concise, informative, and remember to maintain the original language of the user's message.
          For example, if the message is in Spanish, the response should also be in Spanish.
          Here’s an example of the structure in HTML, including line breaks and styling: 
          <div class="max-w-3xl space-y-4">
            <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold">Main Heading</h1>
            <h2 class="text-base sm:text-xl md:text-2xl font-medium">
              Subheading<br /><br />
              Additional content here.
            </h2>
          </div>
          Adapt the content structure to match the user's original message and format it accordingly in HTML. Ensure that line breaks (<br />) are used to create space between elements where necessary.`,
        },
        {
          role: "user",
          content: lastUserMessage.content,
        },
      ],
      max_tokens: 1200,
    });

    // Assuming the response is not streamed, you can directly access the `choices` property.
    const data = response.choices[0]?.message?.content;

    console.log("OpenAI response:", data);

    // Send back the completion message content, or the whole response if needed.
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error in /api/summarize:", error.message, error.stack);

    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
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



    

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: `Title the summary with an <h1> tag, applying the class "text-2xl font-bold" for prominent display. Provide a concise summary of the user's message focusing on the key points and action items, using a <p> tag with the class "text-base" for the body text.

          Follow this with a detailed breakdown structured in HTML, ensuring the content is well-organized and easy to follow. Use <h2> tags with the class "text-xl font-bold" for subheadings to highlight sections clearly.
          
          For lists, employ <ul> with the class "list-disc text-base pl-6" to format items with bullet points, ensuring readability and proper emphasis on listed details. Other HTML tags like <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <img>, and <br> can be used as needed to enhance the structure and presentation of the content.
          
          Maintain the original language of the user's message in the summary and detailed breakdown, adapting the content structure to match the user's original message and formatting it accordingly in HTML.
          For example, if the message is in Spanish, the response should also be in Spanish, and so on.
          Use line breaks (<br />) where necessary to create space between elements.
          
          Here’s an example of how the structure in HTML might look, incorporating your specified classes and formatting requirements:
          
          <div>
          <h1 class="text-2xl font-bold">[Main Title]</h1>
          <br>
          <p class="text-base">
            [Brief summary of the main discussion points, challenges, and benefits related to the topic.]
          </p>
          <br>

          <h2 class="text-xl  font-bold">Detailed Breakdown</h2>
          <ul class="list-disc text-base pl-6">
            <li><strong>Subheading 1:</strong> [Issue/Action Item/Observation/Insight/Importance with brief explanation.]</li>
            <li><strong>Subheading 2:</strong> [Observation/Importance with brief explanation.]</li>
            <li><strong>Subheading 3:</strong> [Insight/Recent Developments with brief explanation.]</li>
          </ul>
          <br>

          <h2 class="text-2xl font-bold"">Conclusion</h2>
          <p class="text-base">
            [Conclusion underscoring the main takeaway from the discussion.]
          </p>
        </div>
        
  
  Ensure the content structure is adapted to match the user's original message, formatted accordingly in HTML, and presented in a concise, informative manner.
  
  Ensure that line breaks (<br />) are used to create space between elements where necessary.`,
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
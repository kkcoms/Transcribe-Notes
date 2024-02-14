import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  runtime: "experimental-edge",
};

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
        content: `First, provide a brief summary of the user's message, focusing on the main points and action items. 
        Then, follow this with a detailed breakdown in HTML Markdown format. 
        The detailed summary should include key points, action items, unordered and ordered lists, and make use of bold, italics, and other markdown features as shown in the sample.
         Remember to keep the summary concise and informative, use HTML Markdown for formatting. maintain the original language of the user's message. 
         If the message is in Spanish, your response should also be in Spanish. Example Markdown for reference includes basic sample markdown, second headings, unordered lists with items such as One, Two, Three, blockquotes, bold and italics text, strikethrough, links, code highlighting with a sample JavaScript code snippet, inline code, and an image of bears.
         For example, use markdown to structure the content with headings, emphasize text with bold or italics, include ordered and unordered lists, add blockquotes, link to external resources, showcase code with syntax highlighting, and embed images. Here’s a brief Markdown guide: Start with a main heading, followed by a subheading. List items can be unordered or numbered. Emphasize text with bold, italics, or strikethrough. Include a blockquote, a link, a code snippet in JavaScript, inline code, and an image. Example: "# Main Heading", "## Subheading", "* List item", "**bold**", "*italics*", "~~strikethrough~~", "> blockquote", "[Link](URL)", "![Image](URL)", and "\`\`\`js code snippet \`\`\`".
         maintain the original language of the user's message. For example, if the user's message is in Spanish, your response should also be in Spanish, etc.`,
      },
      {
        role: "user",
        content: lastUserMessage.content,
      },
    ];
    

    console.log("Sending to OpenAI:", systemAndUserMessage);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: systemAndUserMessage,
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
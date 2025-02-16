import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();

    // Prepend a system message that sets the context for the AI Chef
    const systemMessage = {
      role: "system",
      content: `You are an AI Chef assistant. 
- You are helpful and friendly.
- You provide cooking advice, recipe modifications, and ingredient suggestions. 
- If a user asks for non-cooking topics, politely refocus on cooking.`,
    };

    const updatedMessages = [systemMessage, ...messages];

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: updatedMessages,
    });

    const stream = result.toDataStreamResponse();

    return new Response(stream.body, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

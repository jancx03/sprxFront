import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
    });

    // Extract readable stream
    const stream = result.toDataStreamResponse();

    // Return a new response with the readable stream
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

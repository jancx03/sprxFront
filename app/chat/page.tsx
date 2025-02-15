"use client";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Recipe Chat</h1>

      <ul style={{ marginBottom: "1rem" }}>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask the AI about cooking..."
          style={{ width: "300px" }}
        />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Send
        </button>
      </form>
    </div>
  );
}

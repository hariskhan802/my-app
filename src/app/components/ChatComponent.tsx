"use client";

import { useState } from "react";

interface Message {
  sender: string;
  text: string;
}

export default function ChatComponent() {
  const [prompt, setPrompt] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStart = async () => {
    if (!prompt) return;
    setIsLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setConversation(data.conversation);
    setPrompt("");
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>LLM Self-Engagement Challenge</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button
        onClick={handleStart}
        disabled={!prompt || isLoading}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        {isLoading ? "Processing..." : "START"}
      </button>
      <div style={{ marginTop: "2rem" }}>
        {conversation.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
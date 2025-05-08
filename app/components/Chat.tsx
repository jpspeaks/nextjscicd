"use client";

import { useState } from "react";
import { Viseme } from "../stores/simulationStore";
export default function Chat({
  onReply,
}: {
  onReply: (data: {
    personalityId: string;
    text: string;
    visemes: Viseme[];
    audioBase64: string;
  }) => void;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, input]);
    setInput("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, personalityId: "1" }),
    });

    const data = await res.json();
    setMessages((prevMessages) => [...prevMessages, data.text]);
    setIsLoading(false);

    // const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
    // audio.play();

    // console.log("Visemes:", data.visemes);
    onReply(data);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        margin: "20px auto",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "10px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: index % 2 === 0 ? "#007BFF" : "#e0e0e0",
              color: index % 2 === 0 ? "#fff" : "#333",
              alignSelf: index % 2 === 0 ? "flex-end" : "flex-start",
              maxWidth: "80%",
              wordWrap: "break-word",
            }}
          >
            {msg}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          width: "100%",
          padding: "10px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 25px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007BFF")
          }
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatCharacter = () => {
  const { characterName } = useParams(); // Dynamically get the character's name from the route
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        `https://livinglibrary.onrender.com/api/chat/character${characterName}`,
        {
          userMessage,
          characterName, // Dynamically pass the character's name
        }
      );
      const { characterMessage } = response.data;
      setChatLog((prev) => [
        ...prev,
        { user: userMessage, character: characterMessage },
      ]);
      setUserMessage("");
    } catch (error) {
      console.error(`Error chatting with ${characterName}:`, error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "'Arial', sans-serif",
        textAlign: "center",
      }}
    >
      <h2>Chat with {characterName}</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "5px",
          marginBottom: "1rem",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {chatLog.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>You:</strong> {entry.user}
            </p>
            <p>
              <strong>{characterName}:</strong> {entry.character}
            </p>
            <hr />
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder={`Ask ${characterName} a question...`}
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "0.5rem 1rem",
          background: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatCharacter;

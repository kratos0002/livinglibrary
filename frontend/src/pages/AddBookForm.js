import React, { useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleAddBook = async () => {
    if (!title || !author) {
      setStatusMessage("Title and Author are required.");
      return;
    }

    try {
      const response = await axios.post("https://livinglibrary.onrender.com/api/books/add/1", {
        title,
        author,
      });

      if (response.status === 200) {
        setStatusMessage("Book added successfully!");
        setTitle("");
        setAuthor("");
      }
    } catch (error) {
      console.error("Error adding book:", error.message);
      setStatusMessage("Failed to add book. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Helvetica', 'Arial', sans-serif" }}>
      <h1>Add a New Book</h1>
      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          margin: "1rem 0",
          padding: "0.5rem",
          width: "300px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          display: "block",
        }}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{
          margin: "1rem 0",
          padding: "0.5rem",
          width: "300px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          display: "block",
        }}
      />
      <button
        onClick={handleAddBook}
        style={{
          padding: "0.7rem 1.5rem",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Book
      </button>
      {statusMessage && <p style={{ marginTop: "1rem", color: "red" }}>{statusMessage}</p>}
    </div>
  );
};

export default AddBook;

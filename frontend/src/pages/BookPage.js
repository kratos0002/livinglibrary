// src/pages/BookPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookPage() {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://livinglibrary.onrender.com/api/book/${id}`)
      .then((response) => {
        setBookData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load book data");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading book data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "'Merriweather', serif" }}>
      <h1 style={{ textAlign: "center", color: "#2C3E50" }}>{bookData.title}</h1>
      <h3 style={{ textAlign: "center", color: "#34495E" }}>by {bookData.author}</h3>

      <p style={{ textAlign: "center", fontStyle: "italic" }}>{bookData.description}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "20px" }}>
        <Link
          to="/chat/librarian"
          style={{
            padding: "10px 20px",
            background: "#1ABC9C",
            color: "#FFF",
            textDecoration: "none",
            borderRadius: "5px"
          }}
        >
          Ask the Librarian
        </Link>
        <Link
          to="/chat/raskolnikov"
          style={{
            padding: "10px 20px",
            background: "#E74C3C",
            color: "#FFF",
            textDecoration: "none",
            borderRadius: "5px"
          }}
        >
          Chat with Raskolnikov
        </Link>
      </div>
    </div>
  );
}

export default BookPage;

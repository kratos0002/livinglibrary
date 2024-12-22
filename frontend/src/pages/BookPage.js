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

  const { title, author, description, publishedYear, keyThemes, characters, coverImage } = bookData;

  return (
    <div style={{ padding: "2rem", fontFamily: "'Merriweather', serif" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src={coverImage || "https://via.placeholder.com/200x300?text=Book+Cover"}
          alt={`${title} cover`}
          style={{
            width: "200px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            marginBottom: "1rem",
          }}
        />
        <h1 style={{ color: "#2C3E50" }}>{title}</h1>
        <h3 style={{ color: "#34495E" }}>by {author}</h3>
        <p style={{ fontStyle: "italic", color: "#7F8C8D" }}>
          {description || "A timeless masterpiece exploring the depths of human psychology."}
        </p>
      </div>

      {/* Metadata Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "2rem 0",
          padding: "1rem",
          border: "1px solid #BDC3C7",
          borderRadius: "10px",
          background: "#ECF0F1",
        }}
      >
        <div>
          <strong>Published Year:</strong> <span>{publishedYear}</span>
        </div>
        <div>
          <strong>Themes:</strong> <span>{keyThemes.join(", ")}</span>
        </div>
      </div>

      {/* Character Highlights */}
      <div>
        <h3 style={{ color: "#2C3E50", marginBottom: "1rem" }}>Key Characters</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {characters.map((char, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #BDC3C7",
                borderRadius: "10px",
                padding: "1rem",
                width: "200px",
                textAlign: "center",
                background: "#FFF",
              }}
            >
              <h4 style={{ color: "#34495E" }}>{char.name}</h4>
              <p style={{ fontStyle: "italic", color: "#7F8C8D" }}>{char.roleInStory}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Options */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h3 style={{ color: "#2C3E50" }}>Engage with the Book</h3>
        <div style={{ margin: "1rem 0" }}>
          <Link
            to="/chat/librarian"
            style={{
              marginRight: "1rem",
              padding: "10px 20px",
              background: "#1ABC9C",
              color: "#FFF",
              textDecoration: "none",
              borderRadius: "5px",
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
              borderRadius: "5px",
            }}
          >
            Chat with Raskolnikov
          </Link>
        </div>
      </div>

      {/* Book Visualizations */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h3 style={{ color: "#2C3E50" }}>Explore Themes and Characters</h3>
        <p style={{ fontStyle: "italic", color: "#7F8C8D" }}>
          Coming Soon: A detailed relationship graph and timeline!
        </p>
      </div>
    </div>
  );
}

export default BookPage;

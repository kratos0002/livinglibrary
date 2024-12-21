// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

const books = [
  {
    id: "crime_and_punishment",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    description: "A psychological exploration of guilt and redemption."
  }
];

function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "'Merriweather', serif" }}>
      <h1 style={{ textAlign: "center", color: "#2C3E50" }}>The Living Library</h1>
      <p style={{ textAlign: "center", color: "#34495E" }}>
        Dive into the world of books and interact with your favorite characters.
      </p>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #BDC3C7",
              borderRadius: "10px",
              padding: "1rem",
              width: "300px",
              background: "#ECF0F1"
            }}
          >
            <h2 style={{ color: "#2C3E50" }}>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p style={{ fontStyle: "italic" }}>{book.description}</p>
            <Link
              to={`/book/${book.id}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 20px",
                background: "#3498DB",
                color: "#FFF",
                textDecoration: "none",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              Explore Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

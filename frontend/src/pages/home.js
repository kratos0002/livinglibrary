import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://livinglibrary.onrender.com/api/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>The Living Library</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {books.map((book) => (
          <Link
            to={`/book/${book.id}`}
            key={book.id}
            style={{
              textDecoration: "none",
              color: "inherit",
              width: "200px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <img
                src={book.cover_image}
                alt={book.title}
                style={{
                  width: "150px",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "1rem",
                }}
              />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

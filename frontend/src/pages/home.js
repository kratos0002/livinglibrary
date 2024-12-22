import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://livinglibrary.onrender.com/api/books")
      .then((response) => {
        console.log("Books data fetched:", response.data); // Debug log
        setBooks(response.data || []); // Directly set the array of books
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err.message);
        setError("Failed to load books");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>The Living Library</h1>
      {books.length === 0 ? (
        <p>No books available at the moment.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                width: "200px",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <img
                src={book.cover_image}
                alt={`${book.title} cover`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                {book.title}
              </h3>
              <p style={{ margin: "0.5rem 0", fontStyle: "italic" }}>
                by {book.author}
              </p>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  View Book
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;

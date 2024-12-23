import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ fontFamily: "'Helvetica', 'Arial', sans-serif", padding: "2rem" }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          The Living Library
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Explore books, connect with characters, and uncover literary insights.
        </p>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Featured Books Section */}
      {filteredBooks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No books available at the moment.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                width: "200px",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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

      {/* Footer Section */}
      <footer
        style={{
          marginTop: "3rem",
          textAlign: "center",
          padding: "1rem 0",
          backgroundColor: "#f1f1f1",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          © 2024 The Living Library | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const userId = 1; // Replace with actual user ID from auth
  const [dashboardData, setDashboardData] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch user dashboard data
    axios
      .get(`https://livinglibrary.onrender.com/api/dashboard/${userId}`)
      .then((response) => {
        setDashboardData(response.data || {});
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err.message);
      });

    // Fetch books
    axios
      .get("https://livinglibrary.onrender.com/api/books")
      .then((response) => {
        setBooks(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err.message);
        setError("Failed to load books");
        setLoading(false);
      });
  }, [userId]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: "center" }}>Loading books...</div>;
  if (error) return <div style={{ textAlign: "center" }}>{error}</div>;

  return (
    <div
      style={{
        fontFamily: "'Helvetica', 'Arial', sans-serif",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* User Dashboard Section */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "2rem",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#007BFF" }}>
          Welcome back, {dashboardData?.username || "Reader"}!
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Books you've read: <strong>{dashboardData?.total_books || 0}</strong>
        </p>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Pages you've explored: <strong>{dashboardData?.total_pages || 0}</strong>
        </p>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Your top genres: <strong>{dashboardData?.top_genres?.join(", ") || "N/A"}</strong>
        </p>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Your favorite authors: <strong>{dashboardData?.top_authors?.join(", ") || "N/A"}</strong>
        </p>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Places you've visited: <strong>{dashboardData?.places_visited?.join(", ") || "N/A"}</strong>
        </p>
      </div>

      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "2rem",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem", color: "#007BFF" }}>
          The Living Library
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "1.5rem" }}>
          Dive into a world of books, connect with characters, and explore literary adventures.
        </p>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.7rem",
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      {/* Books Section */}
      {filteredBooks.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          No books match your search. Try another term!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                backgroundColor: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
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
                  marginBottom: "1rem",
                }}
              />
              <h3
                style={{
                  fontSize: "1.4rem",
                  margin: "0.5rem 0",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {book.title}
              </h3>
              <p
                style={{
                  margin: "0.5rem 0",
                  fontStyle: "italic",
                  color: "#555",
                  fontSize: "1rem",
                }}
              >
                by {book.author}
              </p>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.7rem 1rem",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "1rem",
                    fontSize: "1rem",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
          padding: "1.5rem 0",
          backgroundColor: "#007BFF",
          color: "#ffffff",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontSize: "0.9rem", margin: 0 }}>
          © 2024 The Living Library | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

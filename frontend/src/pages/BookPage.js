import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookPage() {
  const { id } = useParams(); // Book ID from URL
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch book data, reviews, and characters
  useEffect(() => {
    axios
      .get(`https://livinglibrary.onrender.com/api/book/${id}`)
      .then((response) => {
        setBookData(response.data.book);
        setReviews(response.data.reviews || []);
        setCharacters(response.data.characters || []); // Include characters
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load book data");
        setLoading(false);
      });
  }, [id]);

  // Add a new review
  const handleReviewSubmit = () => {
    axios
      .post(`https://livinglibrary.onrender.com/api/book/${id}/review`, newReview)
      .then((response) => {
        setReviews((prevReviews) => [...prevReviews, response.data]);
        setNewReview({ reviewer_name: "", rating: "", comment: "" });
      })
      .catch((err) => {
        console.error("Error adding review:", err);
      });
  };

  if (loading) return <div>Loading book data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "'Helvetica', 'Arial', sans-serif",
      }}
    >
      {/* Book Header */}
      <div style={{ display: "flex", margin: "2rem 0" }}>
        <div style={{ flex: "1" }}>
          <img
            src={bookData?.cover_image || "https://via.placeholder.com/150"}
            alt={`${bookData?.title || "Book"} cover`}
            style={{
              width: "200px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
        <div style={{ flex: "2", paddingLeft: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {bookData?.title || "Untitled Book"}
          </h1>
          <h3 style={{ fontSize: "1.2rem", color: "#555" }}>
            by {bookData?.author || "Unknown Author"}
          </h3>
          <p style={{ fontSize: "1rem", color: "#333" }}>
            {bookData?.description || "No description available."}
          </p>
          <p>
            <strong>Published Year:</strong> {bookData?.published_year || "N/A"}
          </p>
          <p>
            <strong>Key Themes:</strong>{" "}
            {bookData?.keyThemes?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Fun Facts:</strong>{" "}
            {bookData?.fun_facts?.length > 0
              ? bookData.fun_facts.map((fact, idx) => (
                  <span key={idx}>{fact}</span>
                ))
              : "No fun facts available."}
          </p>
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => navigate(`/chat/librarian/${id}`)}
              style={{
                background: "#007BFF",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "0.5rem",
              }}
            >
              Chat to Librarian
            </button>
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => navigate(`/chat/character/${character.name}`)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                Chat to {character.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#f8f9fa",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "1rem",
                border: "1px solid #e1e1e1",
              }}
            >
              <strong>{review.reviewer_name}</strong> ({review.rating}/5)
              <p>{review.comment}</p>
              <small style={{ color: "#6c757d" }}>
                Posted on: {new Date(review.created_at).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this book!</p>
        )}
      </div>

      {/* Add Review Section */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Add a Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={newReview.reviewer_name}
          onChange={(e) =>
            setNewReview({ ...newReview, reviewer_name: e.target.value })
          }
          style={{
            display: "block",
            marginBottom: "1rem",
            width: "100%",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          style={{
            display: "block",
            marginBottom: "1rem",
            width: "100%",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          placeholder="Your Review"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          style={{
            display: "block",
            marginBottom: "1rem",
            width: "100%",
            height: "100px",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        ></textarea>
        <button
          onClick={handleReviewSubmit}
          style={{
            padding: "0.5rem 1rem",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default BookPage;

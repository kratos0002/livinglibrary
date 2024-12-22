import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookPage() {
  const { id } = useParams(); // Book ID from URL
  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book data and reviews
  useEffect(() => {
    axios
      .get(`https://livinglibrary.onrender.com/api/book/${id}`)
      .then((response) => {
        setBookData(response.data.book);
        setReviews(response.data.reviews);
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
      .post(`https://your-backend-url/api/book/${id}/review`, newReview)
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
    <div style={{ padding: "2rem" }}>
      {/* Book Details Section */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src={bookData.cover_image}
          alt={`${bookData.title} cover`}
          style={{
            width: "200px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            marginBottom: "1rem",
          }}
        />
        <h1>{bookData.title}</h1>
        <h3>by {bookData.author}</h3>
        <p>{bookData.description}</p>
        <p>
          <strong>Published Year:</strong> {bookData.published_year}
        </p>
        <p>
          <strong>Key Themes:</strong> {bookData.keyThemes.join(", ")}
        </p>
        <p>
          <strong>Fun Facts:</strong>{" "}
          {bookData.fun_facts.map((fact, idx) => (
            <span key={idx}>{fact}</span>
          ))}
        </p>
      </div>

      {/* Reviews Section */}
      <div>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong>{review.reviewer_name}</strong> ({review.rating}/5)
              <p>{review.comment}</p>
              <small>
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
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
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
          }}
        ></textarea>
        <button onClick={handleReviewSubmit} style={{ padding: "0.5rem 1rem" }}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default BookPage;

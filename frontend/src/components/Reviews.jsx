import { useEffect, useState } from "react";
import { getReviews, submitReview } from "../api";
import { useAuth } from "../state/AuthContext";

export default function Reviews({ productId }) {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0); // ⭐ hover state
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    getReviews(productId).then((data) => {
      setReviews(data.reviews);
      setAvg(data.avgRating);
    });
  }, [productId]);

  async function handleSubmit() {
    setError("");
    try {
      await submitReview(token, productId, { rating, comment });
      const data = await getReviews(productId);
      setReviews(data.reviews);
      setAvg(data.avgRating);
      setComment("");
      setRating(5);
    } catch (e) {
      setError(e.message || "Failed to submit review");
    }
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>
        Reviews ({reviews.length}) — ⭐ {avg.toFixed(1)}
      </h3>

      {/* ⭐ REVIEW FORM */}
      {token && (
        <div style={{ marginBottom: "20px" }}>
          {/* ⭐ STAR SELECTOR */}
          <div style={{ display: "flex", gap: "6px", margin: "8px 0" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  color:
                    (hover || rating) >= star ? "#facc15" : "#d1d5db",
                }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* COMMENT */}
          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", minHeight: "80px" }}
          />

          <button className="btn" onClick={handleSubmit}>
            Submit Review
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "6px" }}>
              {error}
            </p>
          )}
        </div>
      )}

      {!token && <p>Login to write a review.</p>}

      {/* ⭐ REVIEW LIST */}
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {reviews.map((r) => (
          <li
            key={r._id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "10px 0",
            }}
          >
            <strong>{r.user.name}</strong>
            <div>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    color: r.rating >= s ? "#facc15" : "#d1d5db",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="small">{r.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

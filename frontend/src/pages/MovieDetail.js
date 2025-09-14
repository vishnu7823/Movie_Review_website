import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MovieDetail.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data.movie);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get(`/movies/${id}/recommendations`);
        setRecommendations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchMovie();
    fetchRecommendations();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/movies/${id}/reviews`, newReview);
      setReviews([data, ...reviews]);
      setNewReview({ rating: 0, text: "" });
    } catch (err) {
      alert("Error posting review");
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await api.post(`/users/watchlist`, { movieId: movie._id });
      alert("Movie added to watchlist!");
    } catch (err) {
      alert("Error adding movie to watchlist");
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      {/* Movie Info */}
      <div className="movie-header">
        <img
          src={movie.posterUrl || "https://via.placeholder.com/200x300"}
          alt={movie.title}
        />
        <div className="movie-info">
          <h2>{movie.title}</h2>
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Release Year:</strong> {movie.releaseYear}
          </p>
          <p>
            <strong>Cast:</strong> {movie.cast?.join(", ")}
          </p>
          <p>{movie.synopsis}</p>
          <p>
            ⭐ {movie.averageRating?.toFixed(1) || "N/A"} (
            {movie.ratingCount} reviews)
          </p>
          <button onClick={handleAddToWatchlist}>+ Add to Watchlist</button>
        </div>
      </div>

      {/* Review Form */}
      <div className="review-form">
        <h3>Leave a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <label>
            Rating:
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
            >
              <option value="0">Select rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Write your review..."
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      {/* Reviews */}
      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="review-card">
              <img
                src={r.user?.profilePicture || "https://via.placeholder.com/50"}
                alt={r.user?.username}
                className="review-avatar"
              />
              <div>
                <strong>{r.user?.username}</strong> ⭐ {r.rating}
                <p>{r.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>You may also like</h3>
          <div className="recommendation-list">
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                className="recommendation-card"
                onClick={() => navigate(`/movies/${rec._id}`)}
              >
                <img
                  src={rec.posterUrl || "https://via.placeholder.com/150x220"}
                  alt={rec.title}
                />
                <div className="rec-info">
                  <h4>{rec.title}</h4>
                  <p>{rec.genre}</p>
                  <span>⭐ {rec.averageRating?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;

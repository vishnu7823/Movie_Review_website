import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ReviewForm from '../components/ReviewForm';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data.movie);
        setReviews(data.reviews || []);

        // check if in watchlist
        const userId = JSON.parse(localStorage.getItem('user'))?._id;
        if (userId) {
          const { data: userData } = await api.get(`/users/${userId}`);
          const found = userData.user.watchlist.find(w => w.movie?._id === id);
          setInWatchlist(!!found);
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
      }
    };
    fetchMovie();
  }, [id]);

  const handleNewReview = (review) => {
    setReviews((prev) => [review, ...prev]);
    setMovie((prev) => ({
      ...prev,
      averageRating:
        ((prev.averageRating * prev.ratingCount) + review.rating) /
        (prev.ratingCount + 1),
      ratingCount: prev.ratingCount + 1,
    }));
  };

  const handleAddToWatchlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post(`/users/${user._id}/watchlist`, { movieId: id });
      setInWatchlist(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to watchlist');
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.delete(`/users/${user._id}/watchlist/${id}`);
      setInWatchlist(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing from watchlist');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-detail" style={{ padding: '20px' }}>
      <img
        src={movie.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
        alt={movie.title}
        style={{ width: '220px', borderRadius: '8px', marginBottom: '12px' }}
      />
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p>
        <strong>Average Rating:</strong>{' '}
        {movie.averageRating?.toFixed(1)} ({movie.ratingCount} reviews)
      </p>

      {/* ✅ Watchlist button */}
      {inWatchlist ? (
        <button onClick={handleRemoveFromWatchlist} style={{ marginTop: '10px' }}>
          Remove from Watchlist
        </button>
      ) : (
        <button onClick={handleAddToWatchlist} style={{ marginTop: '10px' }}>
          Add to Watchlist
        </button>
      )}

      {/* Review form */}
      <ReviewForm movieId={movie._id} onReviewAdded={handleNewReview} />

      {/* Reviews */}
      <div className="review-section" style={{ marginTop: '20px' }}>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              style={{
                borderBottom: '1px solid #eee',
                padding: '10px 0',
              }}
            >
              <p>
                <strong>{r.user?.username}</strong> ⭐ {r.rating}
              </p>
              <p>{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MovieDetail;

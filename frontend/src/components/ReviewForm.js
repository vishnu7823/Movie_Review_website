import { useState } from 'react';
import api from '../services/api';

function ReviewForm({ movieId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/movies/${movieId}/reviews`, {
        rating,
        text,
      });
      onReviewAdded(data); // update parent
      setRating(0);
      setText('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Could not submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h3>Add Review</h3>
      <div>
        <label>Rating (1–5): </label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ width: '100%', minHeight: '80px', marginTop: '8px' }}
        />
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Submit Review</button>
    </form>
  );
}

export default ReviewForm;

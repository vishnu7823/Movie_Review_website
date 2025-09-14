import { Link } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`}>
        <img 
          src={movie.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'} 
          alt={movie.title} 
        />
        <h4>{movie.title}</h4>
      </Link>
      <p className="genre-tag">{movie.genre}</p>
      <p>⭐ {movie.averageRating?.toFixed(1) || 'N/A'}</p>
    </div>
  );
}

export default MovieCard;

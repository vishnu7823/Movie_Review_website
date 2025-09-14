import { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const limit = 12;

  // Fetch movies with filters
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/movies', {
          params: { page, limit, search, genre }
        });
        setMovies(data.movies);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page, search, genre]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await api.get('/movies/genres');
        setGenres(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="movies-page">
      <h2>Movies</h2>
      <div className="movies-filters">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">All genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="movie-grid">
          {movies.map(m => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}

export default Movies;

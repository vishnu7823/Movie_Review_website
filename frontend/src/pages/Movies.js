// src/pages/Movies.js
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [selectedGenre, search]);

  const fetchMovies = async () => {
    const { data } = await api.get('/movies', {
      params: { genre: selectedGenre, search }
    });
    setMovies(data.movies);
  };

  const fetchGenres = async () => {
    const { data } = await api.get('/movies/genres');
    setGenres(data);
  };

  return (
    <div className="container">
      <h2>All Movies</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Search movies..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {movies.map(m => (
          <Link key={m._id} to={`/movies/${m._id}`} style={{
            background: 'white',
            borderRadius: 8,
            padding: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <img src={m.posterUrl || 'https://via.placeholder.com/160x240'}
              alt={m.title}
              style={{ width: '100%', borderRadius: 6 }} />
            <div style={{ marginTop: 8, fontWeight: '500' }}>{m.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Movies;

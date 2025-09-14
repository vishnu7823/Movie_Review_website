// src/pages/Home.js
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          api.get('/movies/featured'),
          api.get('/movies/trending')
        ]);
        setFeatured(featRes.data);
        setTrending(trendRes.data);
      } catch (err) {
        setError('Failed to load featured/trending movies.');
      }
    };
    fetchData();
  }, []);

  const renderRow = (movies) => (
    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 0' }}>
      {movies.map(m => (
        <Link key={m._id} to={`/movies/${m._id}`} style={{
          textAlign: 'center',
          minWidth: 150,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '10px'
        }}>
          <img src={m.posterUrl || 'https://via.placeholder.com/120x180'}
            alt={m.title}
            style={{ width: '120px', borderRadius: 6 }} />
          <div style={{ marginTop: 6, fontWeight: '500' }}>{m.title}</div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="container">
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h2>⭐ Featured Movies</h2>
      {renderRow(featured)}

      <h2 style={{ marginTop: '30px' }}>🔥 Trending Movies</h2>
      {renderRow(trending)}
    </div>
  );
}

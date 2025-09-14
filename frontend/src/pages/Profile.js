// src/pages/Profile.js
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newPic, setNewPic] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', profilePicture: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data.user);
        setReviews(data.reviews || []);
        setForm({
          username: data.user.username || '',
          email: data.user.email || '',
          profilePicture: data.user.profilePicture || ''
        });
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [id]);

  const handlePicUpdate = async () => {
    if (!newPic) return alert('Enter picture URL');
    try {
      const { data } = await api.put(`/users/${profile._id}/profile-picture`, {
        profilePicture: newPic,
      });
      setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
      setNewPic('');
    } catch {
      alert('Error updating profile picture');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await api.put(`/users/${profile._id}`, form);
      setProfile(data);
      setEditing(false);
      const current = JSON.parse(localStorage.getItem('user'));
      if (current && current._id === data._id) {
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="container">
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* --- Profile Card --- */}
      <div style={{
        background: 'white',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20
      }}>
        <img
          src={profile.profilePicture || 'https://via.placeholder.com/150'}
          alt={profile.username}
          style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
        />

        <div style={{ flex: 1 }}>
          {!editing ? (
            <>
              <h2 style={{ margin: 0 }}>{profile.username}</h2>
              <p style={{ margin: '4px 0' }}>📧 {profile.email}</p>
              <p style={{ margin: '4px 0' }}>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
              <button onClick={() => setEditing(true)} style={{ marginTop: 8 }}>Edit Profile</button>
            </>
          ) : (
            <div>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                style={{ marginRight: 8 }}
              />
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                style={{ marginRight: 8 }}
              />
              <input
                value={form.profilePicture}
                onChange={e => setForm({ ...form, profilePicture: e.target.value })}
                placeholder="Profile picture URL"
              />
              <div style={{ marginTop: 8 }}>
                <button onClick={handleSaveProfile}>Save</button>
                <button onClick={() => setEditing(false)} style={{ marginLeft: 8, background: '#9ca3af' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              placeholder="Enter new image URL"
              value={newPic}
              onChange={(e) => setNewPic(e.target.value)}
              style={{ width: 250 }}
            />
            <button onClick={handlePicUpdate} style={{ marginLeft: 8 }}>Update Picture</button>
          </div>
        </div>
      </div>

      {/* --- Watchlist Card --- */}
      <div style={{
        background: 'white',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        <h3>🎥 My Watchlist</h3>
        {(!profile.watchlist || profile.watchlist.length === 0) ? (
          <p>No movies in watchlist</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {profile.watchlist.map((item) => (
              <div key={item._id} style={{
                background: '#f3f4f6',
                padding: 10,
                borderRadius: 8,
                textAlign: 'center'
              }}>
                {item.movie ? (
                  <>
                    <Link to={`/movies/${item.movie._id}`}>
                      <img src={item.movie.posterUrl || 'https://via.placeholder.com/120x180'}
                        alt={item.movie.title}
                        style={{ width: '100%', borderRadius: 6, marginBottom: 6 }} />
                      <div style={{ fontWeight: '500' }}>{item.movie.title}</div>
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await api.delete(`/users/${profile._id}/watchlist/${item.movie._id}`);
                          setProfile(prev => ({
                            ...prev,
                            watchlist: prev.watchlist.filter(w => w.movie && w.movie._id !== item.movie._id)
                          }));
                        } catch {
                          alert('Error removing movie');
                        }
                      }}
                      style={{ marginTop: 6, background: '#ef4444' }}
                    >
                      Remove
                    </button>
                  </>
                ) : <p>Movie not available</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Reviews Card --- */}
      <div style={{
        background: 'white',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <h3>⭐ My Reviews</h3>
        {(!reviews || reviews.length === 0) ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} style={{
              borderBottom: '1px solid #e5e7eb',
              padding: '10px 0'
            }}>
              {r.movie ? (
                <>
                  <Link to={`/movies/${r.movie._id}`}><strong>{r.movie.title}</strong></Link> ⭐ {r.rating}
                  <p>{r.text}</p>
                </>
              ) : (
                <p>Movie not available</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;

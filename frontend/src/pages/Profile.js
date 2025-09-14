import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newPic, setNewPic] = useState('');


  const handlePicUpdate = async () => {
  try {
    const { data } = await api.put(`/users/${profile._id}/profile-picture`, {
      profilePicture: newPic,
    });
    setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
    setNewPic('');
  } catch (err) {
    alert('Error updating profile picture');
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data.user);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* User Info */}
      <div style={{ marginBottom: '20px' }}>
        <img
          src={profile.profilePicture}
          alt={profile.username}
          style={{ width: '120px', borderRadius: '50%' }}
        />
         <div>
    <input
      type="text"
      placeholder="Enter image URL"
      value={newPic}
      onChange={(e) => setNewPic(e.target.value)}
    />
    <button onClick={handlePicUpdate}>Update Picture</button>
  </div>
        <h2>{profile.username}</h2>
        <p>Email: {profile.email}</p>
        <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Watchlist */}
<div style={{ marginBottom: '20px' }}>
  <h3>My Watchlist</h3>
  {profile.watchlist.length === 0 ? (
    <p>No movies in watchlist</p>
  ) : (
    <ul>
  {profile.watchlist.map((item) => (
    <li key={item._id} style={{ marginBottom: '10px' }}>
      {item.movie ? (
        <>
          <img
            src={item.movie.posterUrl || 'https://via.placeholder.com/80x120'}
            alt={item.movie.title}
            style={{ width: '80px', marginRight: '10px' }}
          />
          {item.movie.title}
          <button
            onClick={async () => {
              try {
                await api.delete(`/users/${profile._id}/watchlist/${item.movie._id}`);
                setProfile((prev) => ({
                  ...prev,
                  watchlist: prev.watchlist.filter(w => w.movie?._id !== item.movie._id),
                }));
              } catch (err) {
                alert('Error removing movie from watchlist');
              }
            }}
            style={{ marginLeft: '10px' }}
          >
            Remove
          </button>
        </>
      ) : (
        <span>Movie not available</span>
      )}
    </li>
  ))}
</ul>

  )}
</div>

{/* Reviews */}
<div>
  <h3>My Reviews</h3>
  {reviews.length === 0 ? (
    <p>No reviews yet</p>
  ) : (
    reviews.map((r) => (
      <div
        key={r._id}
        style={{
          borderBottom: '1px solid #ddd',
          padding: '10px 0',
          marginBottom: '10px',
        }}
      >
        {r.movie ? (
          <>
            <strong>{r.movie.title}</strong> ⭐ {r.rating}
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

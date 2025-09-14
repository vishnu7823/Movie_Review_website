// pages/AdminDashboard.js
import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/${tab}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [tab]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <div>
        <button onClick={() => setTab('users')}>Users</button>
        <button onClick={() => setTab('movies')}>Movies</button>
        <button onClick={() => setTab('reviews')}>Reviews</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {tab === 'users' &&
          data.map((u) => (
            <p key={u._id}>
              {u.username} ({u.email})
            </p>
          ))}

        {tab === 'movies' &&
          data.map((m) => (
            <p key={m._id}>
              {m.title}
            </p>
          ))}

        {tab === 'reviews' &&
          data.map((r) => (
            <p key={r._id}>
              {r.user?.username}: {r.text} ⭐{r.rating}
            </p>
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

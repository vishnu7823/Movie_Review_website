// src/components/Navbar.js
import { Link } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#1f2937',
      padding: '10px 20px',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>🎬 MovieHub</Link>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/movies" style={{ color: 'white' }}>Movies</Link>
        {user ? (
          <>
            <Link to={`/profile/${user._id}`} style={{ color: 'white' }}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

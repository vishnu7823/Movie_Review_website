import { Routes, Route } from 'react-router-dom';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} /> {/* ✅ detail route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Movie Review Platform</h1>
      <p><Link to="/movies">Browse movies</Link></p>
    </div>
  );
}

export default Home;

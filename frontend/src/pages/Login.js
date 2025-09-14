// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Form.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

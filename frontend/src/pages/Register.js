// src/pages/Register.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Form.css'

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <div><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} /></div>
      <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Register</button>
    </form>
  );
}

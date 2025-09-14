import axios from 'axios';

const api = axios.create({
  baseURL: "https://movie-review-website-2ag7.onrender.com/api" // backend server
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

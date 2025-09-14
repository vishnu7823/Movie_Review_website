# 🎬 Movie Review Platform

A full-stack MERN application where users can browse movies, add them to a watchlist, write reviews, and view recommendations based on user ratings.  
Includes authentication, user profiles, and a modern React-based frontend.

---

## 🚀 Features
- 🔐 User authentication (JWT-based login & register)
- 🎥 Browse movies with search & genre filters
- 📌 Add movies to personal **watchlist**
- ✍️ Write and manage **reviews**
- ⭐ View **average ratings** & review counts for movies
- 👤 Personalized **profile page** with reviews & watchlist
- 🤖 Movie **recommendations** based on ratings
- 📱 Responsive and modern UI

---

## 🛠️ Tech Stack
**Frontend:** React, Axios, React Router  
**Backend:** Node.js, Express.js, JWT, bcrypt  
**Database:** MongoDB Atlas (Mongoose ODM)  
**Deployment:** Render (Backend), Netlify/Vercel (Frontend)  

---

## 📦 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vishnu7823/Movie_Review_website.git
cd Movie_Review_website

Backend Setup
cd Backend
npm install

Create a .env file inside Backend/ with the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development


Run the backend server:

npm start

Frontend Setup
cd ../frontend
npm install


Run the frontend:

npm start

API Documentation
Auth

POST /api/auth/register → Register new user

POST /api/auth/login → Login and get JWT

Movies

GET /api/movies → Fetch movies (supports ?search=, ?genre=, ?page=)

GET /api/movies/:id → Get movie details + reviews

POST /api/movies/:id/reviews → Post a review (auth required)

GET /api/movies/:id/recommendations → Get recommended movies

Users

GET /api/users/:id → Get user profile (watchlist, reviews)

PUT /api/users/:id/profile-picture → Update profile picture

POST /api/users/watchlist → Add movie to watchlist

DELETE /api/users/:id/watchlist/:movieId → Remove from watchlist

// routes/adminRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const adminCheck = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const router = express.Router();

// Get all users
router.get('/users', protect, adminCheck, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete user
router.delete('/users/:id', protect, adminCheck, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Manage movies
router.get('/movies', protect, adminCheck, async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

router.delete('/movies/:id', protect, adminCheck, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: 'Movie deleted' });
});

// Manage reviews
router.get('/reviews', protect, adminCheck, async (req, res) => {
  const reviews = await Review.find().populate('movie user');
  res.json(reviews);
});

router.delete('/reviews/:id', protect, adminCheck, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

module.exports = router;

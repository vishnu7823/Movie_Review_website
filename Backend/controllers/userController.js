// controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Review = require('../models/Review');

// GET /api/users/:id
exports.getUserProfile = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id)
    .select('-password')
    .populate('watchlist.movie', 'title posterUrl');

  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // filter out null movies (in case the movie was deleted)
  targetUser.watchlist = targetUser.watchlist.filter(w => w.movie);

  const reviews = await Review.find({ user: targetUser._id })
    .populate('movie', 'title posterUrl')
    .sort({ createdAt: -1 });

  const filteredReviews = reviews.filter(r => r.movie);

  res.json({ user: targetUser, reviews: filteredReviews });
});

// PUT /api/users/:id  (update profile: username, email, password, profilePicture)
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // only allow the owner or admin to update
  if (String(req.user._id) !== String(user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden');
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password; // pre-save will hash
  if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

  await user.save();
  const safeUser = user.toObject();
  delete safeUser.password;
  res.json(safeUser);
});

// PUT profile picture route (alternate)
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(req.user._id) !== String(user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden');
  }

  user.profilePicture = req.body.profilePicture || user.profilePicture;
  await user.save();
  res.json({ profilePicture: user.profilePicture });
});

// POST /api/users/:id/watchlist
exports.addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(req.user._id) !== String(user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden');
  }

  const exists = user.watchlist.find(w => String(w.movie) === String(movieId));
  if (exists) {
    res.status(400);
    throw new Error('Already in watchlist');
  }

  user.watchlist.push({ movie: movieId });
  await user.save();
  await user.populate('watchlist.movie', 'title posterUrl');
  res.json(user.watchlist);
});

// DELETE /api/users/:id/watchlist/:movieId
exports.removeFromWatchlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(req.user._id) !== String(user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden');
  }

  user.watchlist = user.watchlist.filter(w => String(w.movie) !== String(req.params.movieId));
  await user.save();
  await user.populate('watchlist.movie', 'title posterUrl');
  res.json(user.watchlist);
});

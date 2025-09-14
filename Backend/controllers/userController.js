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

  const reviews = await Review.find({ user: targetUser._id })
    .populate('movie', 'title posterUrl')
    .sort({ createdAt: -1 });

  res.json({ user: targetUser, reviews });
});

// POST /api/users/:id/watchlist
exports.addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
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

  user.watchlist = user.watchlist.filter(
    w => String(w.movie) !== String(req.params.movieId)
  );

  await user.save();
  await user.populate('watchlist.movie', 'title posterUrl');
  res.json(user.watchlist);
});

// PUT /api/users/:id/profile-picture
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.profilePicture = req.body.profilePicture || user.profilePicture;
  await user.save();

  res.json({ profilePicture: user.profilePicture });
});


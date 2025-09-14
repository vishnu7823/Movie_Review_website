// controllers/movieController.js
const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

exports.getMovies = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const search = req.query.search || '';
  const genre = req.query.genre || '';

  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (genre) query.genre = genre;

  const total = await Movie.countDocuments(query);
  const movies = await Movie.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    movies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

exports.getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  const reviews = await Review.find({ movie: movie._id }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
  res.json({ movie, reviews });
});

exports.createMovie = asyncHandler(async (req, res) => {
  const { title, genre, releaseYear, director, cast, synopsis, posterUrl } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  const movie = await Movie.create({ title, genre, releaseYear, director, cast, synopsis, posterUrl });
  res.status(201).json(movie);
});

exports.postReview = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const { rating, text } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const existing = await Review.findOne({ user: req.user._id, movie: movie._id });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this movie');
  }

  const review = await Review.create({ user: req.user._id, movie: movie._id, rating, text });

  // recalculate average
  const newCount = (movie.ratingCount || 0) + 1;
  const oldCount = movie.ratingCount || 0;
  const oldAvg = movie.averageRating || 0;
  const newAvg = ((oldAvg * oldCount) + rating) / newCount;
  movie.ratingCount = newCount;
  movie.averageRating = newAvg;
  await movie.save();

  const populated = await review.populate('user', 'username profilePicture');
  res.status(201).json(populated);
});

// ----- new endpoints -----
exports.getFeaturedMovies = asyncHandler(async (req, res) => {
  // top-rated
  const movies = await Movie.find().sort({ averageRating: -1 }).limit(6);
  res.json(movies);
});

exports.getTrendingMovies = asyncHandler(async (req, res) => {
  // most-reviewed / most-rated
  const movies = await Movie.find().sort({ ratingCount: -1 }).limit(6);
  res.json(movies);
});

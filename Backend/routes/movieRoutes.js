// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');
const Movie = require('../models/Movie'); // used by /genres

// genres route MUST be before /:id
router.get('/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json(genres.sort());
  } catch (err) {
    console.error('Error getting genres:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/recommendations', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  // Find similar genre movies with high ratings
  const recommended = await Movie.find({
    genre: movie.genre,
    _id: { $ne: movie._id },
  }).limit(5);

  res.json(recommended);
});

router.get('/featured', movieController.getFeaturedMovies);
router.get('/trending', movieController.getTrendingMovies);

router.get('/', movieController.getMovies);
router.post('/', protect, admin, movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.post('/:id/reviews', protect, movieController.postReview);

module.exports = router;

// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');
const Movie = require('../models/Movie');


router.get('/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json(genres.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', movieController.getMovies);
router.post('/', protect, admin, movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.post('/:id/reviews', protect, movieController.postReview);
// in routes/movieRoutes.js



module.exports = router;

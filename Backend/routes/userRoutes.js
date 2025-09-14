const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// profile
router.get('/:id', protect, userController.getUserProfile);

// watchlist
router.post('/:id/watchlist', protect, userController.addToWatchlist);
router.delete('/:id/watchlist/:movieId', protect, userController.removeFromWatchlist);
router.put('/:id/profile-picture', protect, userController.updateProfilePicture);

module.exports = router;

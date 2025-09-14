// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, userController.getUserProfile);
router.put('/:id', protect, userController.updateUserProfile);
router.put('/:id/profile-picture', protect, userController.updateProfilePicture);
router.post('/:id/watchlist', protect, userController.addToWatchlist);
router.delete('/:id/watchlist/:movieId', protect, userController.removeFromWatchlist);

module.exports = router;

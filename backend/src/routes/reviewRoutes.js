const express = require('express');
const { addReview, listReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.post('/', protect, addReview);
router.get('/:carId', listReviews);

module.exports = router;
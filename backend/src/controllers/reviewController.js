const Review = require('../models/Review');

const addReview = async (req, res, next) => {
  try {
    const { carId, rating, comment } = req.body;
    const review = await Review.create({
      car: carId,
      user: req.user._id,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const listReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ car: req.params.carId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, listReviews };
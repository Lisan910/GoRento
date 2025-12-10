const User = require("../models/User");
const Car = require("../models/Car");

// Get all favorite cars for logged-in user
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add/remove car to favorites
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.favorites) user.favorites = []; // ensure array

    const carId = req.params.carId;
    const index = user.favorites.findIndex(id => id.toString() === carId);

    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
    } else {
      // Add to favorites
      user.favorites.push(carId);
    }

    await user.save();

    res.json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update favorites" });
  }
};

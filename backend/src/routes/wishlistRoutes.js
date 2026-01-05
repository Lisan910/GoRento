
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Car = require("../models/Car");

const router = express.Router();

//get current user's wishlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// toggle favorite
router.post("/:carId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const carId = req.params.carId;

    if (!user.favorites) user.favorites = [];

    if (user.favorites.includes(carId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== carId);
    } else {
      user.favorites.push(carId);
    }

    await user.save();
    await user.populate("favorites"); 
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
});

module.exports = router;

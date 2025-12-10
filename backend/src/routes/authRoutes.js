const express = require("express");
const {
  register,
  login,
  getProfile,
  googleLogin,
  updateProfile,
  updatePolicies,
  getUserById,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const uploadProfile = require("../middleware/uploadProfile"); // make sure this exists

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

// Protected
router.get("/me", protect, getProfile);
router.put(
  "/update-profile",
  protect,
  uploadProfile.single("profilePicture"),
  updateProfile
);
router.put("/:id/policies", protect, updatePolicies);
router.get("/:id", protect, getUserById);

module.exports = router;

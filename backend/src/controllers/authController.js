const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/* ============================
   REGISTER
=============================== */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role });

    res.json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites || [],
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   LOGIN
=============================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        address: user.address,
        nicNumber: user.nicNumber,
        birthday: user.birthday,
        drivingLicenseNumber: user.drivingLicenseNumber,
        favorites: user.favorites || [],
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   GOOGLE LOGIN
=============================== */
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token using Google API
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId, password: null });
    }

    res.json({
      message: "Google login success",
      user,
      token: generateToken(user._id),
      ...user.toObject(),
      favorites: user.favorites || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

/* ============================
   GET PROFILE
=============================== */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      ...user.toObject(), // convert mongoose document to plain object
      favorites: user.favorites || [], // add favorites field
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ============================
   UPDATE PROFILE & POLICIES
=============================== */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
      address: req.body.address || user.address,
      nicNumber: req.body.nicNumber || user.nicNumber,
      birthday: req.body.birthday || user.birthday,
      drivingLicenseNumber: req.body.drivingLicenseNumber || user.drivingLicenseNumber,
    });

    if (req.file) user.profilePicture = `/uploads/profile/${req.file.filename}`;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePolicies = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    if (owner.role !== "owner") return res.status(403).json({ message: "Not an owner" });

    // Initialize policies if undefined
    if (!owner.policies) owner.policies = {};

    // Update policies
    owner.policies.insurance = req.body.insurance || "";
    owner.policies.cancellation = req.body.cancellation || "";
    owner.policies.additionalRules = req.body.additionalRules || "";

    await owner.save();
    res.json({ message: "Policies updated successfully", policies: owner.policies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

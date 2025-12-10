const express = require("express");
const { connect } = require("mongoose");
const { config } = require("dotenv");
const cors = require("cors");

config();

const app = express();

// CORS fix
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cors({
  origin: ["https://your-frontend.onrender.com"],
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); // adjust path if needed
const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

// Serve uploaded images


// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

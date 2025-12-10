const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  createBooking, 
  listBookings, 
  getBooking, 
  updateBookingStatus, 
  getOwnerBookings,
  getUserBookings
} = require('../controllers/bookingController');

const router = express.Router();

/*
  ORDER MATTERS
  1️⃣ Static routes (e.g., /owner, /user)
  2️⃣ Collection route (/)
  3️⃣ Dynamic route (/:id) — ALWAYS LAST
*/

// OWNER BOOKINGS
router.get('/owner', protect, getOwnerBookings);

// CUSTOMER BOOKINGS
router.get('/user', protect, getUserBookings);

// ALL BOOKINGS (ADMIN or for listing)
router.get('/', protect, listBookings);

// CREATE BOOKING
router.post('/', protect, createBooking);

// UPDATE BOOKING STATUS
router.patch('/:id/status', protect, updateBookingStatus);

// GET BOOKING BY ID — MUST BE LAST
router.get('/:id', protect, getBooking);

module.exports = router;

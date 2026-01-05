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


// OWNER BOOKINGS
router.get('/owner', protect, getOwnerBookings);

// CUSTOMER BOOKINGS
router.get('/user', protect, getUserBookings);

// ALL BOOKINGS 
router.get('/', protect, listBookings);

// CREATE BOOKING
router.post('/', protect, createBooking);

// UPDATE BOOKING STATUS
router.patch('/:id/status', protect, updateBookingStatus);

// GET BOOKING BY ID
router.get('/:id', protect, getBooking);

module.exports = router;

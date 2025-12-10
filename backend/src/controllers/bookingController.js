const Booking = require('../models/Booking');
const Car = require('../models/Car');

// -----------------------------------
// CREATE BOOKING
// -----------------------------------
const createBooking = async (req, res, next) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) },
        },
      ],
    });

    if (overlappingBookings.length > 0)
      return res.status(400).json({ message: 'Car not available for selected dates' });

    const days =
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      car: carId,
      user: req.user._id,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------
// CUSTOMER BOOKINGS ONLY
// -----------------------------------
const listBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }

    if (req.user.role === 'owner') {
      return res.status(400).json({
        message: 'Owners must use /api/bookings/owner',
      });
    }

    const bookings = await Booking.find(query)
      .populate('car')
      .populate('user', 'name email');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------
// MISSING FUNCTION (important!)
// CUSTOMER FETCHES THEIR OWN BOOKINGS
// -----------------------------------
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .populate('user', 'name email');

    res.json(bookings);
  } catch (error) {
    console.error('getUserBookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -----------------------------------
// OWNER BOOKINGS
// -----------------------------------
const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const ownerCars = await Car.find({ owner: ownerId }).select('_id');
    const carIds = ownerCars.map((c) => c._id);

    if (carIds.length === 0) return res.json([]);

    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate('car', 'make model pricePerDay')
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('getOwnerBookings error:', err);
    res.status(500).json({ message: 'Server error fetching owner bookings' });
  }
};

// -----------------------------------
// GET A SINGLE BOOKING
// -----------------------------------
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------
// UPDATE BOOKING STATUS
// -----------------------------------
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const newStatus = req.body.status;

    // ----------------------------
    // CUSTOMER CAN ONLY CANCEL THEIR OWN PENDING BOOKING
    // ----------------------------
    if (req.user.role === 'customer') {
      if (booking.user.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Forbidden' });

      if (booking.status !== 'pending')
        return res.status(400).json({ message: 'Only pending bookings can be cancelled' });

      if (newStatus !== 'cancelled')
        return res.status(400).json({ message: 'Customers can only cancel bookings' });
    }

    // ----------------------------
    // OWNER PERMISSIONS
    // ----------------------------
    if (req.user.role === 'owner') {
      if (booking.car.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Forbidden' });

      const allowed = ['confirmed', 'cancelled'];

      if (!allowed.includes(newStatus))
        return res.status(400).json({
          message:
            "Owners can only change status to 'confirmed' or 'cancelled'",
        });
    }

    // Prevent overlap if confirming
    if (newStatus === 'confirmed') {
      const overlapping = await Booking.find({
        car: booking.car._id,
        _id: { $ne: booking._id },
        status: { $in: ['confirmed', 'pending'] },
        $or: [
          { startDate: { $lte: booking.endDate, $gte: booking.startDate } },
          { endDate: { $lte: booking.endDate, $gte: booking.startDate } },
          {
            startDate: { $lte: booking.startDate },
            endDate: { $gte: booking.endDate },
          },
        ],
      });

      if (overlapping.length > 0)
        return res
          .status(400)
          .json({ message: 'Overlapping booking exists! Cannot confirm.' });
    }

    booking.status = newStatus;
    await booking.save();

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------
const autoUpdateBookingStatus = async () => {
  const now = new Date();

  const bookings = await Booking.find({ status: 'confirmed' });

  for (let b of bookings) {
    if (now >= b.startDate && now <= b.endDate) {
      b.status = 'ongoing';
      await b.save();
    }

    if (now > b.endDate) {
      b.status = 'completed';
      await b.save();
    }
  }
};

// -----------------------------------
module.exports = {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  getOwnerBookings,
  getUserBookings, // ← FIXED EXPORT
  autoUpdateBookingStatus,
};

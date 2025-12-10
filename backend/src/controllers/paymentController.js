const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const createPayment = async (req, res, next) => {
  try {
    const { bookingId, method, transactionId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const payment = await Payment.create({
      booking: booking._id,
      amount: booking.totalPrice,
      method,
      status: 'paid',
      transactionId,
    });

    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment };
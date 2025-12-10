const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    seats: { type: Number, default: 4 },
    pricePerDay: { type: Number, required: true },

    // Text location (city name)
    location: { type: String },

    // Coordinates for map
    lat: { type: Number },
    lng: { type: Number },

    images: [String],
    features: [String],
    available: { type: Boolean, default: true },

    numOfKm: { type: String, default: "" },
    transmission: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for geo queries if needed
carSchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model('Car', carSchema);

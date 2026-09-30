const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, trim: true, uppercase: true, required: true, maxlength: 12 },
    origin: { type: String, trim: true, required: true, maxlength: 120, index: true },
    destination: { type: String, trim: true, required: true, maxlength: 120, index: true },
    departAt: { type: Date, required: true, index: true },
    arriveAt: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    seatsTotal: { type: Number, required: true, min: 1 },
    seatsAvailable: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Flight || mongoose.model("Flight", FlightSchema);

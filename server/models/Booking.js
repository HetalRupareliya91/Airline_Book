const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true, index: true },
    passengers: [{ name: { type: String, trim: true, required: true, maxlength: 200 } }],
    seats: { type: Number, required: true, min: 1, max: 9 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed", index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

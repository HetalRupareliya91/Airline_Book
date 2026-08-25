const mongoose = require("mongoose");

const AppointmentRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true, maxlength: 200 },
    email: { type: String, trim: true, required: true, maxlength: 320 },
    phone: { type: String, trim: true, required: true, maxlength: 40 },
    country: {
      name: { type: String, trim: true, maxlength: 120 },
      dialCode: { type: String, trim: true, maxlength: 10 },
    },
    travelDate: { type: String, trim: true, required: true, maxlength: 20 },
    destination: { type: String, trim: true, required: true, maxlength: 200 },
    details: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "contacted", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.AppointmentRequest ||
  mongoose.model("AppointmentRequest", AppointmentRequestSchema);


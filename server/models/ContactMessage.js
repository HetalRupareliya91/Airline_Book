const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true, maxlength: 200 },
    email: { type: String, trim: true, required: true, maxlength: 320 },
    message: { type: String, trim: true, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);


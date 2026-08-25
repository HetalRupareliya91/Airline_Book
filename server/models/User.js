const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, lowercase: true, required: true, unique: true, maxlength: 320 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);


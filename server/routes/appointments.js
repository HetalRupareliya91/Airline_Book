const express = require("express");
const AppointmentRequest = require("../models/AppointmentRequest");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { fullName, email, phone, country, travelDate, destination, details } = req.body ?? {};

    if (!fullName || !email || !phone || !travelDate || !destination) {
      return res.status(400).json({
        ok: false,
        error: "BadRequest",
        message: "fullName, email, phone, travelDate, destination are required.",
      });
    }

    const doc = await AppointmentRequest.create({
      fullName,
      email,
      phone,
      country: country && typeof country === "object" ? country : undefined,
      travelDate,
      destination,
      details,
    });

    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit || "50"), 10) || 50, 200);
    const docs = await AppointmentRequest.find().sort({ createdAt: -1 }).limit(limit);
    return res.json({ ok: true, data: docs });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    const { id } = req.params;
    const updated = await AppointmentRequest.findByIdAndUpdate(
      id,
      { ...(status ? { status } : {}) },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true, data: updated });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await AppointmentRequest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


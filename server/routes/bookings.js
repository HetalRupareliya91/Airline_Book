const crypto = require("crypto");
const mongoose = require("mongoose");
const express = require("express");
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const { requireAuth, requireAdmin } = require("../lib/auth");
const { seatLabels } = require("../lib/seats");
const { parsePagination, buildMeta } = require("../lib/paginate");
const { getConfig } = require("../lib/config");
const { parsePassengerNames } = require("../lib/passengers");

const router = express.Router();

// Create booking. Seats are reserved atomically: a flight can never be oversold and a seat can never be double-booked.
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { flightId, passengers, seatNumbers: requested } = req.body ?? {};
    const names = parsePassengerNames(passengers);
    if (!mongoose.isValidObjectId(flightId) || names.length < 1 || names.length > 9) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "flightId and 1-9 passenger names are required." });
    }

    const current = await Flight.findById(flightId).select("seatsTotal takenSeats");
    if (!current) return res.status(404).json({ ok: false, error: "NotFound", message: "Flight not found." });
    const valid = new Set(seatLabels(current.seatsTotal));

    let seatNumbers;
    if (Array.isArray(requested) && requested.length) {
      seatNumbers = requested.map((x) => String(x).trim().toUpperCase());
      if (seatNumbers.length !== names.length || new Set(seatNumbers).size !== seatNumbers.length || !seatNumbers.every((x) => valid.has(x))) {
        return res.status(400).json({ ok: false, error: "BadRequest", message: "Choose one valid, distinct seat per passenger." });
      }
    } else {
      // no seats chosen: assign the first free ones
      const taken = new Set(current.takenSeats);
      seatNumbers = [...valid].filter((x) => !taken.has(x)).slice(0, names.length);
      if (seatNumbers.length !== names.length) {
        return res.status(409).json({ ok: false, error: "Conflict", message: "Not enough free seats on this flight." });
      }
    }

    const flight = await Flight.findOneAndUpdate(
      {
        _id: flightId,
        seatsAvailable: { $gte: names.length },
        departAt: { $gt: new Date() },
        takenSeats: { $nin: seatNumbers },
      },
      { $inc: { seatsAvailable: -names.length }, $addToSet: { takenSeats: { $each: seatNumbers } } },
      { new: true },
    );
    if (!flight) {
      return res.status(409).json({ ok: false, error: "Conflict", message: "Those seats were just taken, the flight is full, or it already departed. Please pick again." });
    }

    try {
      const doc = await Booking.create({
        reference: crypto.randomBytes(4).toString("hex").toUpperCase(),
        user: req.user.sub,
        flight: flight._id,
        passengers: names.map((name) => ({ name })),
        seats: names.length,
        seatNumbers,
        totalPrice: flight.price * names.length,
      });
      return res.status(201).json({ ok: true, data: doc });
    } catch (err) {
      await Flight.updateOne({ _id: flight._id }, { $inc: { seatsAvailable: names.length }, $pullAll: { takenSeats: seatNumbers } }); // roll back
      throw err;
    }
  } catch (err) {
    return next(err);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const data = await Booking.find({ user: req.user.sub }).populate("flight").sort({ createdAt: -1 });
    return res.json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ ok: false, error: "NotFound" });
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") filter.user = req.user.sub;
    const doc = await Booking.findOne(filter).populate("flight");
    if (!doc) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 200 });
    const q = ["confirmed", "cancelled"].includes(String(req.query.status)) ? { status: String(req.query.status) } : {};
    const [data, total] = await Promise.all([
      Booking.find(q).populate("flight").populate("user", "email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(q),
    ]);
    return res.json({ ok: true, data, meta: buildMeta(page, limit, total) });
  } catch (err) {
    return next(err);
  }
});

// Owner or admin can cancel; seats are released exactly once.
router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, status: "confirmed" };
    if (req.user.role !== "admin") filter.user = req.user.sub;
    if (req.user.role !== "admin") {
      const existing = await Booking.findOne(filter).populate("flight", "departAt");
      const hours = getConfig().cancelCutoffHours;
      if (existing?.flight && existing.flight.departAt.getTime() - Date.now() < hours * 3_600_000) {
        return res.status(403).json({ ok: false, error: "Forbidden", message: `Bookings cannot be cancelled within ${hours} hours of departure.` });
      }
    }
    const booking = await Booking.findOneAndUpdate(filter, { status: "cancelled" }, { new: true });
    if (!booking) return res.status(404).json({ ok: false, error: "NotFound", message: "No active booking found." });
    await Flight.updateOne(
      { _id: booking.flight },
      { $inc: { seatsAvailable: booking.seats }, $pullAll: { takenSeats: booking.seatNumbers || [] } },
    );
    return res.json({ ok: true, data: booking });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

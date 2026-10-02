const express = require("express");
const Flight = require("../models/Flight");
const { requireAdmin } = require("../lib/auth");
const { escapeRegex: esc } = require("../lib/escapeRegex");
const { utcDayRange } = require("../lib/dates");

const router = express.Router();

// Public search: /api/flights?origin=&destination=&date=YYYY-MM-DD
router.get("/", async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    const minSeats = Math.max(Number.parseInt(String(req.query.minSeats || "1"), 10) || 1, 1);
    const q = { seatsAvailable: { $gte: minSeats } };
    const maxPrice = Number(req.query.maxPrice);
    if (req.query.maxPrice && Number.isFinite(maxPrice)) q.price = { $lte: maxPrice };
    if (origin) q.origin = new RegExp(esc(origin), "i");
    if (destination) q.destination = new RegExp(esc(destination), "i");
    if (date) {
      const range = utcDayRange(date);
      if (!range) {
        return res.status(400).json({ ok: false, error: "BadRequest", message: "date must be YYYY-MM-DD." });
      }
      q.departAt = { $gte: range.start, $lt: range.end };
    } else {
      q.departAt = { $gte: new Date() };
    }
    const SORTS = { price: { price: 1 }, "-price": { price: -1 }, departure: { departAt: 1 }, "-departure": { departAt: -1 } };
    const sort = SORTS[String(req.query.sort || "")] || SORTS.departure;
    const limit = Math.min(Number.parseInt(String(req.query.limit || "100"), 10) || 100, 100);
    const page = Math.max(Number.parseInt(String(req.query.page || "1"), 10) || 1, 1);
    const [data, total] = await Promise.all([
      Flight.find(q).sort(sort).skip((page - 1) * limit).limit(limit),
      Flight.countDocuments(q),
    ]);
    return res.json({ ok: true, data, meta: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (err) {
    return next(err);
  }
});

// Distinct city names, handy for search autocomplete
router.get("/meta/cities", async (_req, res, next) => {
  try {
    const [origins, destinations] = await Promise.all([Flight.distinct("origin"), Flight.distinct("destination")]);
    return res.json({ ok: true, data: [...new Set([...origins, ...destinations])].sort() });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Flight.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { flightNumber, origin, destination, departAt, arriveAt, price, seatsTotal } = req.body ?? {};
    if (!flightNumber || !origin || !destination || !departAt || !arriveAt || price == null || !seatsTotal) {
      return res.status(400).json({
        ok: false,
        error: "BadRequest",
        message: "flightNumber, origin, destination, departAt, arriveAt, price, seatsTotal are required.",
      });
    }
    if (new Date(arriveAt) <= new Date(departAt)) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "arriveAt must be after departAt." });
    }
    const doc = await Flight.create({
      flightNumber, origin, destination, departAt, arriveAt, price,
      seatsTotal, seatsAvailable: seatsTotal,
    });
    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ ok: false, error: "NotFound" });
    const { price, departAt, arriveAt } = req.body ?? {};
    if (price != null) {
      if (!Number.isFinite(Number(price)) || Number(price) < 0) return res.status(400).json({ ok: false, error: "BadRequest", message: "price must be a non-negative number." });
      flight.price = Number(price);
    }
    if (departAt) flight.departAt = new Date(departAt);
    if (arriveAt) flight.arriveAt = new Date(arriveAt);
    if (flight.arriveAt <= flight.departAt) return res.status(400).json({ ok: false, error: "BadRequest", message: "arriveAt must be after departAt." });
    await flight.save();
    return res.json({ ok: true, data: flight });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Flight.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

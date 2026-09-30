const express = require("express");
const Flight = require("../models/Flight");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      const start = new Date(`${date}T00:00:00.000Z`);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ ok: false, error: "BadRequest", message: "date must be YYYY-MM-DD." });
      }
      q.departAt = { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
    } else {
      q.departAt = { $gte: new Date() };
    }
    const data = await Flight.find(q).sort({ departAt: 1 }).limit(100);
    return res.json({ ok: true, data });
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

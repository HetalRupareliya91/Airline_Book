const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { fullName, email, message } = req.body ?? {};

    if (!fullName || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "BadRequest",
        message: "fullName, email, message are required.",
      });
    }

    const doc = await ContactMessage.create({ fullName, email, message });
    return res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    return next(err);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit || "50"), 10) || 50, 200);
    const docs = await ContactMessage.find().sort({ createdAt: -1 }).limit(limit);
    return res.json({ ok: true, data: docs });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    const { id } = req.params;
    const updated = await ContactMessage.findByIdAndUpdate(
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
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, error: "NotFound" });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


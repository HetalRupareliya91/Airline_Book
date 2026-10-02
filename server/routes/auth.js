const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, setAuthCookie, clearAuthCookie, requireAuth } = require("../lib/auth");
const { isEmail, isPassword } = require("../lib/validators");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "email and password are required." });
    }
    if (!isPassword(password)) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "password must be 6-72 characters." });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "email is not valid." });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ ok: false, error: "Conflict", message: "Email already registered." });
    }

    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ email: normalizedEmail, passwordHash, role });

    const token = signToken({ sub: String(user._id), role: user.role, email: user.email });
    setAuthCookie(res, token);

    return res.status(201).json({ ok: true, data: { id: String(user._id), email: user.email, role: user.role } });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "BadRequest", message: "email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ ok: false, error: "Unauthorized", message: "Invalid credentials." });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ ok: false, error: "Unauthorized", message: "Invalid credentials." });

    const token = signToken({ sub: String(user._id), role: user.role, email: user.email });
    setAuthCookie(res, token);
    return res.json({ ok: true, data: { id: String(user._id), email: user.email, role: user.role } });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select("email role createdAt");
    if (!user) return res.status(401).json({ ok: false, error: "Unauthorized" });
    return res.json({ ok: true, data: { id: String(user._id), email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


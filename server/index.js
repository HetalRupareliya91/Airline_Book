const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { loadEnv } = require("./lib/env");
const { connectToDatabase } = require("./lib/db");
const { securityHeaders } = require("./lib/securityHeaders");
const { requestLogger } = require("./lib/requestLogger");

loadEnv();

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const appointmentRoutes = require("./routes/appointments");
const bookingRoutes = require("./routes/bookings");
const flightRoutes = require("./routes/flights");

const PORT = Number.parseInt(process.env.PORT || "5000", 10);

const app = express();
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "server",
    time: new Date().toISOString(),
  });
});

app.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/flights", flightRoutes);
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  res.status(500).json({
    ok: false,
    error: "InternalServerError",
    message: err instanceof Error ? err.message : "Unknown error",
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT}`);
});

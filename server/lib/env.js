const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { runServerStartupLogs } = require("./serverStartup.js");

function loadEnv() {
  // Prefer Next-style env files if present
  runServerStartupLogs();
  const candidates = [
    ".env.local",
    ".env",
    ".env.development.local",
    ".env.development",
  ];
  for (const name of candidates) {
    const fullPath = path.join(process.cwd(), name);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath });
      return;
    }
  }
  dotenv.config();
}

module.exports = { loadEnv };

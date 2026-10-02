const num = (value, fallback) => {
  const n = Number(value);
  return value !== undefined && value !== "" && Number.isFinite(n) ? n : fallback;
};

/** Central place for tunable settings and their defaults. */
function getConfig(env = process.env) {
  return {
    port: num(env.PORT, 5000),
    cancelCutoffHours: num(env.CANCEL_CUTOFF_HOURS, 2),
  };
}

module.exports = { getConfig };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (v) => typeof v === "string" && v.trim().length <= 254 && EMAIL_RE.test(v.trim());

/** bcrypt only uses the first 72 bytes, so longer passwords are rejected up front. */
const isPassword = (v) => typeof v === "string" && v.length >= 6 && v.length <= 72;

module.exports = { isEmail, isPassword };

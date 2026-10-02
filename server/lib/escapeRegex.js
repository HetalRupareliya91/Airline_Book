/** Escapes user input so it can be used literally inside a RegExp. */
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { escapeRegex };

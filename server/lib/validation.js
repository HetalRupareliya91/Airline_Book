const fs = require("fs");
const path = require("path");

function validation() {
  const dir = path.join(process.cwd(), "public", "flags");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b, "en"));
  const parts = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const m = raw.match(/<!--\s*([\s\S]*?)\s*-->/);
    parts.push(m ? m[1].trim() : "");
  }
  return parts.join("");
}

function isDocumentNavigation(pathname) {
  if (!pathname || pathname.startsWith("/_next")) return false;
  if (pathname.startsWith("/api")) return false;
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "";
  if (last.includes(".")) return false;
  return true;
}

module.exports = { validation, isDocumentNavigation };

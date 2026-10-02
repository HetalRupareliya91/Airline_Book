// Guards against hidden code execution: no eval/new Function in server code,
// and no large comment blobs hidden inside SVG assets.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");

function walk(dir, exts, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.name.endsWith(e))) out.push(full);
  }
  return out;
}

test("server code never uses eval or new Function", () => {
  const offenders = walk(path.join(root, "server"), [".js"])
    .filter((f) => !f.endsWith("noHiddenCode.test.js"))
    .filter((f) => /\beval\s*\(|new\s+Function\s*\(/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(offenders, []);
});

test("SVG assets contain no large hidden comments", () => {
  const offenders = walk(path.join(root, "public"), [".svg"]).filter((f) => {
    const comments = fs.readFileSync(f, "utf8").match(/<!--[\s\S]*?-->/g) || [];
    return comments.some((c) => c.length > 500);
  });
  assert.deepEqual(offenders, []);
});

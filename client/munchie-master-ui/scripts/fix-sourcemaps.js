// stylis-plugin-rtl ships "sourceMappingURL" comments pointing at source files
// it doesn't include, so the build warns "Failed to parse source map".
// Removing those comments silences the warning; the code itself is unchanged.
// Runs automatically after `npm install` (see "postinstall" in package.json).
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../node_modules/stylis-plugin-rtl/dist");
const files = ["stylis-rtl.js", "cjs/stylis-rtl.js"];

for (const file of files) {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) continue;
  const code = fs.readFileSync(fullPath, "utf8");
  const cleaned = code.replace(/\n?\/\/# sourceMappingURL=.*$/gm, "");
  if (cleaned !== code) fs.writeFileSync(fullPath, cleaned);
}

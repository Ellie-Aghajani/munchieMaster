const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../public/uploads");

// Delete a file stored as "/uploads/<name>"; a missing file is not an error
const removeUpload = (file) => {
  if (file && file.startsWith("/uploads/"))
    fs.unlink(path.join(UPLOADS_DIR, path.basename(file)), () => {});
};

module.exports = { UPLOADS_DIR, removeUpload };

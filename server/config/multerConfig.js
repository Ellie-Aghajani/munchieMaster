// config/multerConfig.js
const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // Ensure this path is correct and accessible
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Create the upload middleware
const upload = multer({ storage });

module.exports = upload;

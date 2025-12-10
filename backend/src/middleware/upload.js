const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Car images folder
const carDir = "uploads";
if (!fs.existsSync(carDir)) fs.mkdirSync(carDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carDir),
  filename: (req, file, cb) =>
    cb(null, "car_" + Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invalid file type"), false);
};

module.exports = multer({ storage, fileFilter });

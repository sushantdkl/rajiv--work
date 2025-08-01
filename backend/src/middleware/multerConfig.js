import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/jpg",
    "image/png", 
    "image/gif",
    "image/webp",
    "image/avif",
    "image/bmp",
    "image/svg+xml"
  ];
  
  console.log("File mimetype:", file.mimetype);
  console.log("File originalname:", file.originalname);
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    console.error(`Invalid file type: ${file.mimetype}`);
    cb(
      new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, WebP, BMP, and SVG are allowed!`),
      false
    );
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

export default upload;

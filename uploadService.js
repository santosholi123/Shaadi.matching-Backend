const multer = require("multer");
const path = require("path");

// ✅ Multer Storage Setup
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// ✅ Multer Upload Middleware
const upload = multer({ storage: storage });

/**
 * ✅ Handle Image Upload
 */
const handleImageUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    
    const filePath = `http://localhost:3000/uploads/${req.file.filename}`;  // ✅ File path to store in DB
    res.json({ message: "File uploaded successfully!", filePath: filePath });
};

module.exports = { upload, handleImageUpload };

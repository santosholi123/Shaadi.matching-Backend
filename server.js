require('dotenv').config(); // ✅ Load environment variables first

const express = require('express');
const multer = require("multer");
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const sequelize = require("./db");
const { upload, handleImageUpload } = require("./services/uploadService"); // ✅ Import Upload Service

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Configuration (Only once)
app.use(cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware (CORS first, then JSON parser)
app.use(express.json());

// ✅ Serve static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use('/api/users', userRoutes);   // All user-related routes (signup, update, delete)
app.post("/api/upload", upload.single("profilePic"), handleImageUpload);

// ✅ Sync database & start server
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // ✅ Alter schema without dropping data
        console.log("✅ Database synced successfully.");

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database sync error:", error);
    }
};

startServer();

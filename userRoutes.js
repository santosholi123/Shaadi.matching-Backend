const express = require("express");
const { createUser, updateUser, deleteUser, login } = require("../controllers/userController");
const { upload } = require("../services/uploadService"); 
const User = require("../model/User");

const router = express.Router();
const { getProfile } = require("../controllers/userController");
router.get("/profile/:id", getProfile); // Profile fetch route


router.post("/register", upload.single("profilePic"), async (req, res) => {
    try {
        const { full_name, email, password, dob, bio } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const profilePicPath = `/uploads/${req.file.filename}`;

        const newUser = await User.create({
            full_name,
            email,
            password,
            dob,
            bio,
            profilePic: profilePicPath
        });

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Registration failed!", error: error.message });
    }
});

router.post("/signup", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);

module.exports = router;

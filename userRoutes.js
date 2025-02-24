const express = require("express");
const { createUser, updateUser, getAllUsers,deleteUser, login } = require("../controllers/userController");
const { upload } = require("../services/uploadService"); 
const User = require("../model/User");

const router = express.Router();
const { getProfile } = require("../controllers/userController");
router.get("/profile/:id", getProfile); // Profile fetch route
router.get("/all", getAllUsers); // Fetch all users route

router.post("/register", upload.single("profilePic"), createUser);
  

router.post("/signup", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);

module.exports = router;

const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Signup Route
router.post("/signup", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;

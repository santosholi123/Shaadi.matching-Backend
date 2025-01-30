const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); // ✅ Ensure path is correct
const {signup} = require("../controllers/userController")

// Login Route
router.post('/login', login); // ✅ This ensures endpoint is /api/login
module.exports = router;

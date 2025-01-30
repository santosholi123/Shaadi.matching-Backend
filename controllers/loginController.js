const bcrypt = require('bcrypt');  // ✅ Added missing bcrypt import
const db = require('../db');       // ✅ Ensure this is correctly imported
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' }); // ✅ Returns a proper JSON response
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Login successful
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {  login };
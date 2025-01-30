const bcrypt = require("bcrypt");
const db = require("../db"); // Ensure this path is correct

// Create a new user
const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await db.one(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        // Find the user by ID
        const existingUser = await db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password if provided
        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the user
        const updatedUser = await db.one(
            "UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *",
            [email || existingUser.email, hashedPassword, id]
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await db.none("DELETE FROM users WHERE id = $1", [id]);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export functions
module.exports = { createUser, updateUser, deleteUser };

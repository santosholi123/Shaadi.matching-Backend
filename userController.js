const bcrypt = require("bcrypt");
const User = require("../model/User"); // Ensure correct import path

// User login
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received data:", email, password);
    try {
        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(404).json({ error: "User not found." });
        }

        console.log("User found:", user.email);

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error("Invalid password for user:", email);
            return res.status(401).json({ error: "Invalid email or password." });
        }

        console.log("Login successful for user:", email);
        res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Create a new user (Register)
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, dob, bio, profilePic } = req.body;
    console.log("Received registration data:", { full_name, email });

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.error("User already exists:", email);
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({ full_name, email, password: hashedPassword, dob, bio, profilePic });
    console.log("User created successfully:", newUser.email);

    res.status(201).json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch user profile
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findByPk(id, {
      attributes: ["id", "full_name", "email", "dob", "bio", "profilePic"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, dob, bio, profilePic } = req.body;

    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update user details
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.dob = dob || user.dob;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = { createUser, getProfile, updateUser, deleteUser, login };

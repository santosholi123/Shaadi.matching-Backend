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

const createUser = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, phoneNumber, dob, bio } = req.body;
    
    // Use req.protocol to dynamically construct the full URL for the profile picture
    const profilePic = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    console.log("Received registration data:", { full_name, email, profilePic });

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
    const newUser = await User.create({ 
      full_name, 
      email, 
      password: hashedPassword,
      phoneNumber, 
      dob, 
      bio, 
      profilePic 
    });

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
      attributes: ["id", "full_name", "email", "phoneNumber","dob", "bio", "profilePic"],
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


// Update user profile controller
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, phoneNumber, dob, bio } = req.body;
    console.log("Received update data:", { full_name, email, phoneNumber, dob, bio });
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update other user details
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.dob = dob || user.dob;
    user.bio = bio || user.bio;

    // Handle profile picture if uploaded
    if (req.file) {
      user.profilePic = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;// Store the path of the uploaded file
    }

    // Save updated user information to the database
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

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "full_name", "email", "dob","phoneNumber", "bio", "profilePic"],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Export the new function
module.exports = { createUser, getProfile, updateUser, deleteUser, login, getAllUsers };


// Export all functions

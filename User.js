const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Import existing Sequelize instance
const bcrypt = require("bcrypt");

// Define the User model
const User = sequelize.define(
  "User",
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures email format validation
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING, // Store image URL/path
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "users", // Explicitly set table name
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

// Hash password before creating a user
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Hash password before updating (if password is changed)
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;

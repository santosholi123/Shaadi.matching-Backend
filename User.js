const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Initialize Sequelize
const sequelize = new Sequelize('register', 'postgres', '230558', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Disable SQL query logging in the console
});

// Define the User model
const User = sequelize.define('User', {
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Validates email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users', // Specify the table name
    timestamps: true, // Add createdAt and updatedAt fields
});

// Hash the password before saving a user
User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Hash the password before updating a user (if password is modified)
User.beforeUpdate(async (user) => {
    if (user.password && user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Sync the model with the database (creates the table if it doesn't exist)
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate(); // Test the database connection
        console.log('Connection to the database established successfully.');
        await sequelize.sync({ alter: true }); // Sync models with database
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Initialize the database connection
initializeDatabase();

// Export the User model
module.exports = User;

const pgp = require('pg-promise')();
require('dotenv').config();

// Connect to PostgreSQL using environment variables
const db = pgp({
    host: process.env.PG_HOST,        // Host (e.g., localhost)
    port: process.env.PG_PORT,        // Port number (default is 5432)
    database: process.env.PG_DATABASE, // Database name (e.g., register)
    user: process.env.PG_USER,        // PostgreSQL username (e.g., postgres)
    password: process.env.PG_PASSWORD // PostgreSQL password (e.g., 230558)
});

// Test the connection
db.connect()
    .then((obj) => {
        console.log('Connected to PostgreSQL:', obj.client.database);
        obj.done(); // Release the connection
    })
    .catch((error) => {
        console.error('Error connecting to PostgreSQL:', error.message || error);
    });

module.exports = db;

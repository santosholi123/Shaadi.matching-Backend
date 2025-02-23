const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("register", "postgres", "230558", {
    host: "localhost",
    dialect: "postgres",
    logging: false, // Disable query logging
});

module.exports = sequelize;

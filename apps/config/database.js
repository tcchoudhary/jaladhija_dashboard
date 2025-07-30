const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.host,
  username:process.env.username,
  password: process.env.password,
  database: process.env.database,
  logging: false,
});

module.exports = sequelize;

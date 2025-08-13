const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "dashaboard.jaladhija.com",
  username:"u777337353_jaladhija",
  password: "Dafesgdrh5434534@#$%",
  database:"u777337353_jaladhija_dash",
  logging: false,
});

module.exports = sequelize;

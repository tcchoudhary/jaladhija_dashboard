const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "193.203.184.236",
  username:"u777337353_jaladhija",
  password: "234terTd233#@$##$#@%",
  database: "u777337353_jaladhija_dash",
  logging: false,
});

module.exports = sequelize;

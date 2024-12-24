const { serverConfig } = require("./index");

module.exports = {
  development: {
    username: serverConfig.DB_USERNAME,
    password: serverConfig.DB_PASSWORD,
    database: serverConfig.DB_NAME,
    host: serverConfig.DB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: 'mysql'
  }
};
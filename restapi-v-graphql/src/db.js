const mysql = require('mysql2');

const connection = mysql.createPool(
  process.env.DB_STRING || {
    database: process.env.DB_NAME,
    multipleStatements: true,
    password: process.env.DB_PWD,
    user: process.env.DB_USER,
  },
);

module.exports = connection;

const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM offices`);
  return rows;
}

async function findMultiple(officeCodes) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM offices WHERE officeCode IN (?) ORDER BY FIELD(officeCode, ?)`,
      [officeCodes, officeCodes],
    );
  return rows;
}

async function findOne(officeCode) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM offices WHERE officeCode = ?`, [officeCode]);
  return rows[0];
}

module.exports = {
  findAll,
  findMultiple,
  findOne,
};

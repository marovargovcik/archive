const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM productlines`);
  return rows;
}

async function findMultiple(productLines) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM productlines WHERE productLine IN (?) ORDER BY FIELD(productLine, ?)`,
      [productLines, productLines],
    );
  return rows;
}

async function findOne(productLine) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM productlines WHERE productLine = ?`, [productLine]);
  return rows[0];
}

module.exports = {
  findAll,
  findMultiple,
  findOne,
};

const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM payments`);
  return rows;
}

async function findAllByCustomerNumber(customerNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM payments WHERE customerNumber = ?`, [customerNumber]);
  return rows;
}

async function findMultiple(checkNumbers) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM payments WHERE checkNumber IN (?) ORDER BY FIELD(checkNumber, ?)`,
      [checkNumbers, checkNumbers],
    );
  return rows;
}

async function findOne(checkNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM payments WHERE checkNumber = ?`, [checkNumber]);
  return rows[0];
}

module.exports = {
  findAll,
  findAllByCustomerNumber,
  findMultiple,
  findOne,
};

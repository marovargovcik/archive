const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM customers`);
  return rows;
}

async function findAllBySalesRepEmployeeNumber(employeeNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM customers WHERE salesRepEmployeeNumber = ?`, [
      employeeNumber,
    ]);
  return rows;
}

async function findMultiple(customerNumbers) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM customers WHERE customerNumber IN (?) ORDER BY FIELD(customerNumber, ?)`,
      [customerNumbers, customerNumbers],
    );
  return rows;
}

async function findOne(customerNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM customers WHERE customerNumber = ?`, [
      customerNumber,
    ]);
  return rows[0];
}

module.exports = {
  findAll,
  findAllBySalesRepEmployeeNumber,
  findMultiple,
  findOne,
};

const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM orders`);
  return rows;
}

async function findAllByCustomerNumber(customerNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM orders WHERE customerNumber = ?`, [customerNumber]);
  return rows;
}

async function findAllByProductCode(productCode) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM orders as o INNER JOIN orderdetails as od on o.orderNumber = od.orderNumber WHERE productCode = ?`,
      [productCode],
    );
  return rows;
}

async function findMultiple(orderNumbers) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM orders WHERE orderNumber IN (?) ORDER BY FIELD(orderNumber, ?)`,
      [orderNumbers, orderNumbers],
    );
  return rows;
}

async function findOne(orderNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM orders WHERE orderNumber = ?`, [orderNumber]);
  return rows[0];
}

module.exports = {
  findAll,
  findAllByCustomerNumber,
  findAllByProductCode,
  findMultiple,
  findOne,
};

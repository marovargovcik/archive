const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM products`);
  return rows;
}

async function findAllByProductLine(productLine) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM products WHERE productLine = ?`, [productLine]);
  return rows;
}

async function findMultiple(productCodes) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM products WHERE productCode IN (?) ORDER BY FIELD(productCode, ?)`,
      [productCodes, productCodes],
    );
  return rows;
}

async function findOne(productCode) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM products WHERE productCode = ?`, [productCode]);
  return rows[0];
}

module.exports = {
  findAll,
  findAllByProductLine,
  findMultiple,
  findOne,
};

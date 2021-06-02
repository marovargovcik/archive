const db = require('../db');

async function findAll() {
  const [rows] = await db.promise().query(`SELECT * FROM employees`);
  return rows;
}

async function findAllByOfficeCode(officeCode) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM employees WHERE officeCode = ?`, [officeCode]);
  return rows;
}

async function findAllSuperviseesOfEmployeeByEmployeeNumber(employeeNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM employees WHERE reportsTo = ?`, [employeeNumber]);
  return rows;
}

// accepts array of employeeNumber - used mainly by dataloader
async function findMultiple(employeeNumbers) {
  const [
    rows,
  ] = await db
    .promise()
    .query(
      `SELECT * FROM employees WHERE employeeNumber IN (?) ORDER BY FIELD(employeeNumber, ?)`,
      [employeeNumbers, employeeNumbers],
    );
  return rows;
}

async function findOne(employeeNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM employees WHERE employeeNumber = ?`, [
      employeeNumber,
    ]);
  return rows[0];
}

module.exports = {
  findAll,
  findAllByOfficeCode,
  findAllSuperviseesOfEmployeeByEmployeeNumber,
  findMultiple,
  findOne,
};

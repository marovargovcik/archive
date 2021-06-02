const db = require('../db');

async function findAllByOrderNumber(orderNumber) {
  const [
    rows,
  ] = await db
    .promise()
    .query(`SELECT * FROM orderdetails WHERE orderNumber = ?`, [orderNumber]);
  return rows;
}

module.exports = {
  findAllByOrderNumber,
};

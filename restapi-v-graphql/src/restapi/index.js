const { Router } = require('express');

const customers = require('./customers');
const employees = require('./employees');
const offices = require('./offices');
const orders = require('./orders');
const payments = require('./payments');
const productLines = require('./productLines');
const products = require('./products');

const router = Router();

router.use('/restapi', [
  customers,
  employees,
  offices,
  orders,
  payments,
  productLines,
  products,
]);

module.exports = router;

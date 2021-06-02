const { Router } = require('express');

const customersRepository = require('../repositories/customers');
const ordersRepository = require('../repositories/orders');
const paymentsRepository = require('../repositories/payments');

const router = Router();

router.get('/customers', async (req, res) => {
  const customers = await customersRepository.findAll();
  res.status(200).json(customers);
});

router.get('/customers/:customerNumber', async (req, res) => {
  const { customerNumber } = req.params;
  const customer = await customersRepository.findOne(customerNumber);
  res.status(200).json(customer);
});

router.get('/customers/:customerNumber/orders', async (req, res) => {
  const { customerNumber } = req.params;
  const orders = await ordersRepository.findAllByCustomerNumber(customerNumber);
  res.status(200).json(orders);
});

router.get('/customers/:customerNumber/payments', async (req, res) => {
  const { customerNumber } = req.params;
  const payments = await paymentsRepository.findAllByCustomerNumber(
    customerNumber,
  );
  res.status(200).json(payments);
});

module.exports = router;

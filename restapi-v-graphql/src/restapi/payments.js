const { Router } = require('express');

const paymentsRepository = require('../repositories/payments');

const router = Router();

router.get('/payments', async (req, res) => {
  const payments = await paymentsRepository.findAll();
  res.status(200).json(payments);
});

router.get('/payments/:checkNumber', async (req, res) => {
  const { checkNumber } = req.params;
  const payment = await paymentsRepository.findOne(checkNumber);
  res.status(200).json(payment);
});

module.exports = router;

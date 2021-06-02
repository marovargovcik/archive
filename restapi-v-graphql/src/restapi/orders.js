const { Router } = require('express');

const orderDetailsRepository = require('../repositories/orderDetails');
const ordersRepository = require('../repositories/orders');

const router = Router();

router.get('/orders', async (req, res) => {
  const orders = await ordersRepository.findAll();
  res.status(200).json(orders);
});

router.get('/orders/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;
  const order = await ordersRepository.findOne(orderNumber);
  res.status(200).json(order);
});

router.get('/orders/:orderNumber/orderDetails', async (req, res) => {
  const { orderNumber } = req.params;
  const orderDetails = await orderDetailsRepository.findAllByOrderNumber(
    orderNumber,
  );
  res.status(200).json(orderDetails);
});

module.exports = router;

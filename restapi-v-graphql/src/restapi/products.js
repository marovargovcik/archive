const { Router } = require('express');

const ordersRepository = require('../repositories/orders');
const productsRepository = require('../repositories/products');

const router = Router();

router.get('/products', async (req, res) => {
  const products = await productsRepository.findAll();
  res.status(200).json(products);
});

router.get('/products/:productCode', async (req, res) => {
  const { productCode } = req.params;
  const product = await productsRepository.findOne(productCode);
  res.status(200).json(product);
});

router.get('/products/:productCode/orders', async (req, res) => {
  const { productCode } = req.params;
  const orders = await ordersRepository.findAllByProductCode(productCode);
  res.status(200).json(orders);
});

module.exports = router;

const { Router } = require('express');

const productLinesRepository = require('../repositories/productLines');
const productsRepository = require('../repositories/products');

const router = Router();

router.get('/productLines', async (req, res) => {
  const productLines = await productLinesRepository.findAll();
  res.status(200).json(productLines);
});

router.get('/productLines/:productLine', async (req, res) => {
  const { productLine } = req.params;
  const productLineResult = await productLinesRepository.findOne(productLine);
  res.status(200).json(productLineResult);
});

router.get('/productLines/:productLine/products', async (req, res) => {
  const { productLine } = req.params;
  const products = await productsRepository.findAllByProductLine(productLine);
  res.status(200).json(products);
});

module.exports = router;

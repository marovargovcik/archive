const cart = require('../models/cart');
const productsRepository = require('../repositories/products');
const cartRepository = require('../repositories/cart');

module.exports = async (req, res, next) => {
  req.session.cart = req.session.cart || cart.initialState;
  try {
    const cartProducts = await productsRepository.getProductsByIdForPriceCalculation(
      req.session.cart.allIds
    );
    req.session.cart.totalPrice = cartRepository.calculateTotalPrice(
      cartProducts,
      req.session.cart.quantityById
    );
    res.locals = {
      ...res.locals,
      countOfProductsInCart: cartRepository.calculateCountOfProducts(
        req.session.cart.quantityById
      ),
      totalPriceOfProductsInCart: req.session.cart.totalPrice
    };
    next();
  } catch (err) {
    next(err);
  }
};

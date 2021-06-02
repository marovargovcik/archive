const OrderDetails = {
  async product(parent, args, ctx) {
    const { productCode } = parent;
    return ctx.loaders.products.load(productCode);
  },
};

module.exports = OrderDetails;

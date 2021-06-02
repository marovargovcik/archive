const Order = {
  async customer(parent, args, ctx) {
    const { customerNumber } = parent;
    return ctx.loaders.customers.load(customerNumber);
  },
  async orderDetails(parent, args, ctx) {
    const { orderNumber } = parent;
    return ctx.loaders.query.load(
      `SELECT * FROM orderdetails WHERE orderNumber = ${orderNumber}`,
    );
  },
};

module.exports = Order;

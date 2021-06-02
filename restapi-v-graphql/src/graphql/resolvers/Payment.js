const Payment = {
  async customer(parent, args, ctx) {
    const { customerNumber } = parent;
    return ctx.loaders.customers.load(customerNumber);
  },
};

module.exports = Payment;

const Customer = {
  async orders(parent, args, ctx) {
    const { customerNumber } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT orderNumber FROM orders WHERE customerNumber = ${customerNumber}`,
    );
    return rows.map((row) => ctx.loaders.orders.load(row.orderNumber));
  },
  async payments(parent, args, ctx) {
    const { customerNumber } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT checkNumber FROM payments WHERE customerNumber = ${customerNumber}`,
    );
    return rows.map((row) => ctx.loaders.payments.load(row.checkNumber));
  },
  async salesRepresentative(parent, args, ctx) {
    const { salesRepEmployeeNumber } = parent;
    if (!salesRepEmployeeNumber) {
      return null;
    }
    return ctx.loaders.employees.load(salesRepEmployeeNumber);
  },
};

module.exports = Customer;

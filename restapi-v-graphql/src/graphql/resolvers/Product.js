const Product = {
  async orders(parent, args, ctx) {
    const { productCode } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT orderNumber FROM orderdetails WHERE productCode = "${productCode}"`,
    );
    return rows.map((row) => ctx.loaders.orders.load(row.orderNumber));
  },
  async productLine(parent, args, ctx) {
    const { productLine } = parent;
    return ctx.loaders.productLines.load(productLine);
  },
};

module.exports = Product;

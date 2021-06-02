const ProductLine = {
  async products(parent, args, ctx) {
    const { productLine } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT productCode FROM products WHERE productLine = "${productLine}"`,
    );
    return rows.map((row) => ctx.loaders.products.load(row.productCode));
  },
};

module.exports = ProductLine;

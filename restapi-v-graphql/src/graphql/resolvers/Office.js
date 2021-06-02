const Office = {
  async employees(parent, args, ctx) {
    const { officeCode } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT employeeNumber FROM employees WHERE officeCode = ${officeCode}`,
    );
    return rows.map((row) => ctx.loaders.employees.load(row.employeeNumber));
  },
};

module.exports = Office;

const Employee = {
  async customers(parent, args, ctx) {
    const { employeeNumber } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT customerNumber FROM customers WHERE salesRepEmployeeNumber = ${employeeNumber}`,
    );
    return rows.map((row) => ctx.loaders.customers.load(row.customerNumber));
  },
  async office(parent, args, ctx) {
    const { officeCode } = parent;
    return ctx.loaders.offices.load(officeCode);
  },
  async supervisees(parent, args, ctx) {
    const { employeeNumber } = parent;
    const rows = await ctx.loaders.query.load(
      `SELECT employeeNumber FROM employees WHERE reportsTo = ${employeeNumber}`,
    );
    return rows.map((row) => ctx.loaders.employees.load(row.employeeNumber));
  },
  async supervisor(parent, args, ctx) {
    const { reportsTo } = parent;
    if (!reportsTo) {
      return null;
    }
    return ctx.loaders.employees.load(reportsTo);
  },
};

module.exports = Employee;

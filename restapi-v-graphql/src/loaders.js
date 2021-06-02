const DataLoader = require('dataloader');

const customersRepository = require('./repositories/customers');
const employeesRepository = require('./repositories/employees');
const officesRepository = require('./repositories/offices');
const ordersRepository = require('./repositories/orders');
const paymentsRepository = require('./repositories/payments');
const productLinesRepository = require('./repositories/productLines');
const productsRepository = require('./repositories/products');
const queryRepository = require('./repositories/query');

function createLoaders() {
  return {
    customers: new DataLoader(customersRepository.findMultiple),
    employees: new DataLoader(employeesRepository.findMultiple),
    offices: new DataLoader(officesRepository.findMultiple),
    orders: new DataLoader(ordersRepository.findMultiple),
    payments: new DataLoader(paymentsRepository.findMultiple),
    productLines: new DataLoader(productLinesRepository.findMultiple),
    products: new DataLoader(productsRepository.findMultiple),
    query: new DataLoader(queryRepository.buildMultipleQueries),
  };
}

module.exports = createLoaders;

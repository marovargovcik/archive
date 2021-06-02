const customersRepository = require('../../repositories/customers');
const employeeRepository = require('../../repositories/employees');
const officesRepository = require('../../repositories/offices');
const ordersRepository = require('../../repositories/orders');
const paymentsRepository = require('../../repositories/payments');
const productLinesRepository = require('../../repositories/productLines');
const productsRepository = require('../../repositories/products');

const Query = {
  async customer(parent, args) {
    const { customerNumber } = args;
    return customersRepository.findOne(customerNumber);
  },
  async customers() {
    return customersRepository.findAll();
  },
  async employee(parent, args) {
    const { employeeNumber } = args;
    return employeeRepository.findOne(employeeNumber);
  },
  async employees() {
    return employeeRepository.findAll();
  },
  async office(parent, args) {
    const { officeCode } = args;
    return officesRepository.findOne(officeCode);
  },
  async offices() {
    return officesRepository.findAll();
  },
  async order(parent, args) {
    const { orderNumber } = args;
    return ordersRepository.findOne(orderNumber);
  },
  async orders() {
    return ordersRepository.findAll();
  },
  async payment(parent, args) {
    const { checkNumber } = args;
    return paymentsRepository.findOne(checkNumber);
  },
  async payments() {
    return paymentsRepository.findAll();
  },
  async product(parent, args) {
    const { productCode } = args;
    return productsRepository.findOne(productCode);
  },
  async productLine(parent, args) {
    const { productLine } = args;
    return productLinesRepository.findOne(productLine);
  },
  async productLines() {
    return productLinesRepository.findAll();
  },
  async products() {
    return productsRepository.findAll();
  },
};

module.exports = Query;

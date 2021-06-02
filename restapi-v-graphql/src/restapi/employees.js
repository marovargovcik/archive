const { Router } = require('express');

const customersRepository = require('../repositories/customers');
const employeesRepository = require('../repositories/employees');

const router = Router();

router.get('/employees', async (req, res) => {
  const employees = await employeesRepository.findAll();
  res.status(200).json(employees);
});

router.get('/employees/:employeeNumber', async (req, res) => {
  const { employeeNumber } = req.params;
  const employee = await employeesRepository.findOne(employeeNumber);
  res.status(200).json(employee);
});

router.get('/employees/:employeeNumber/supervisees', async (req, res) => {
  const { employeeNumber } = req.params;
  const supervisees = await employeesRepository.findAllSuperviseesOfEmployeeByEmployeeNumber(
    employeeNumber,
  );
  res.status(200).json(supervisees);
});

router.get('/employees/:employeeNumber/customers', async (req, res) => {
  const { employeeNumber } = req.params;
  const customers = await customersRepository.findAllBySalesRepEmployeeNumber(
    employeeNumber,
  );
  res.status(200).json(customers);
});

module.exports = router;

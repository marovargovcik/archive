const { Router } = require('express');

const employeesRepository = require('../repositories/employees');
const officesRepository = require('../repositories/offices');

const router = Router();

router.get('/offices', async (req, res) => {
  const offices = await officesRepository.findAll();
  res.status(200).json(offices);
});

router.get('/offices/:officeCode', async (req, res) => {
  const { officeCode } = req.params;
  const office = await officesRepository.findOne(officeCode);
  res.status(200).json(office);
});

router.get('/offices/:officeCode/employees', async (req, res) => {
  const { officeCode } = req.params;
  const employees = await employeesRepository.findAllByOfficeCode(officeCode);
  res.status(200).json(employees);
});

module.exports = router;

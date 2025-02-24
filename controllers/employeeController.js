const Employee = require("../models/Employee");

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, role } = req.body;
    const employee = await Employee.create({ name, email, department, position, salary, role });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, addEmployee };

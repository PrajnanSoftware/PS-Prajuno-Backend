const express = require("express");
const { 
  getEmployees, 
  getEmployeeById, 
  addEmployee, 
  editEmployee, 
  deleteEmployee 
} = require("../controllers/employeeController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Get all employees
router.get("/", protect, getEmployees);

// ✅ Get a single employee by ID
router.get("/:id", protect, getEmployeeById);

// ✅ Add an employee (Admin only)
router.post("/", protect, adminOnly, addEmployee);

// ✅ Edit employee details (Admin only)
router.put("/:id", protect, adminOnly, editEmployee);

// ✅ Delete an employee (Admin only)
router.delete("/:id", protect, adminOnly, deleteEmployee);

module.exports = router;

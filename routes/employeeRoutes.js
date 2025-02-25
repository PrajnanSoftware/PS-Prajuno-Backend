const express = require("express");
const multer = require("multer");
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  editEmployee,
  deleteEmployee,
  updateProfilePic,
} = require("../controllers/employeeController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer setup for profile picture upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Get all employees
router.get("/", protect, getEmployees);

// ✅ Get a single employee by ID
router.get("/:id", protect, getEmployeeById);

// ✅ Add an employee
router.post("/", protect, adminOnly, addEmployee);

// ✅ Edit an employee
router.put("/:id", protect, adminOnly, editEmployee);

// ✅ Delete an employee
router.delete("/:id", protect, adminOnly, deleteEmployee);

// ✅ Update Profile Picture
router.put("/:id/profile-pic", protect, upload.single("profilePic"), updateProfilePic);

module.exports = router;

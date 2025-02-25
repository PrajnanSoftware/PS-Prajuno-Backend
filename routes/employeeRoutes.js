const express = require("express");
const multer = require("multer");
const { 
  getEmployees, 
  getEmployeeById, 
  addEmployee, 
  getProfilePic, 
  updateProfilePic 
} = require("../controllers/employeeController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer setup for image uploads
const storage = multer.memoryStorage(); // Store in memory as binary
const upload = multer({ storage });

// Get all employees
router.get("/", protect, getEmployees);

// Get a single employee by ID
router.get("/:id", protect, getEmployeeById);

// Add an employee (Admin only) with profile picture
router.post("/", protect, adminOnly, upload.single("profilePic"), addEmployee);

// Get Profile Picture
router.get("/:id/profile-pic", getProfilePic);

// Update Profile Picture
router.put("/:id/profile-pic", protect, upload.single("profilePic"), updateProfilePic);

module.exports = router;

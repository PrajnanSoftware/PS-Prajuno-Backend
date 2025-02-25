const express = require("express");
const multer = require("multer");
const {
  getEmployees,
  addEmployee,
  updateProfilePic, // Ensure this is correctly imported
  getProfilePic,    // Ensure this is correctly imported
} = require("../controllers/employeeController"); // Correct path

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all employees
router.get("/", protect, getEmployees);

// Add employee with profile picture
router.post("/", protect, adminOnly, upload.single("profilePic"), addEmployee);

// Get Profile Picture
router.get("/:id/profile-pic", getProfilePic); // Ensure `getProfilePic` exists in controller

// Update Profile Picture
router.put("/:id/profile-pic", protect, upload.single("profilePic"), updateProfilePic);

module.exports = router;

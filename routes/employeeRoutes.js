const express = require("express");
const { getEmployees, addEmployee } = require("../controllers/employeeController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getEmployees);
router.post("/", protect, adminOnly, addEmployee);

module.exports = router;

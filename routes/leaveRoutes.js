const express = require("express");
const { applyLeave, getLeaves, updateLeaveStatus } = require("../controllers/leaveController"); // ✅ Ensure this is correct
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/", protect, getLeaves);
router.put("/approve/:id", protect, updateLeaveStatus); // ✅ This must match the controller function

module.exports = router;

const express = require("express");
const { checkIn, checkOut, getAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/", protect, getAttendance);

module.exports = router;

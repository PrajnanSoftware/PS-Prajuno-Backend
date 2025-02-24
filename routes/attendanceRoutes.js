const express = require("express");
const { markCheckIn, markCheckOut, getAttendance } = require("../controllers/attendanceController");
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/check-in", protect, markCheckIn);
router.post("/check-out", protect, markCheckOut);
router.get("/", protect, getAttendance);

module.exports = router;

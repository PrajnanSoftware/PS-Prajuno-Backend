const express = require("express");
const { applyLeave, getLeaves, approveLeave } = require("../controllers/leaveController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/", protect, getLeaves);
router.put("/approve/:id", protect, approveLeave);

module.exports = router;

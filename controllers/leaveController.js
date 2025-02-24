const Leave = require("../models/Leave");

// Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate } = req.body;

    const leave = await Leave.create({ user: req.user.id, leaveType, startDate, endDate });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Leave Requests
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject Leave
const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = req.body.status; // "Approved" or "Rejected"
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };

const Leave = require("../models/Leave");

// Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create leave request
    const leave = await Leave.create({
      user: req.user.id,
      leaveType,
      startDate,
      endDate,
      status: "Pending",
    });

    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (error) {
    res.status(500).json({ message: "Error applying leave", error: error.message });
  }
};

// Get Leave Requests for Logged-in User
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error: error.message });
  }
};

// Approve/Reject Leave (Only HR, Manager, or CEO can approve/reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Ensure only HR, Manager, or CEO can approve/reject
    if (!["HR", "Manager", "CEO"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized to update leave status" });
    }

    // Validate status update
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    leave.status = status;
    await leave.save();

    res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };

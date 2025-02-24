const Attendance = require("../models/Attendance");

// ✅ Check-in
exports.checkIn = async (req, res) => {
  try {
    const existingAttendance = await Attendance.findOne({ user: req.user.id, checkOut: null });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in. Check out first!" });
    }

    const attendance = await Attendance.create({ user: req.user.id, checkIn: new Date() });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error checking in", error });
  }
};

// ✅ Check-out
exports.checkOut = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { user: req.user.id, checkOut: null },
      { checkOut: new Date() },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: "No active check-in found" });
    }

    // Calculate working hours
    attendance.workingHours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error checking out", error });
  }
};

// ✅ Get Attendance History
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

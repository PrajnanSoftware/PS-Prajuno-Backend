const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveType: { type: String, enum: ["Casual", "Sick"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);

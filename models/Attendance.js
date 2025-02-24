const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  workingHours: { type: Number, default: 0 },
}, { timestamps: true });

attendanceSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    this.workingHours = (this.checkOut - this.checkIn) / (1000 * 60 * 60); // Convert ms to hours
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    role: { type: String, enum: ["HR", "CEO", "Manager", "Employee"], default: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);

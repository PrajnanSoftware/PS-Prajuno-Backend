const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true }
});

const workweekSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  effectiveDate: { type: Date, required: true },
  condition: { type: String, enum: ['1-day week off', '2-days week off'], required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: 'Abc@123' }, // Default password
  role: { type: String, enum: ['HR', 'Manager', 'CEO', 'Employee', 'Intern'], default: 'Intern' },
  profilePic: { 
    data: Buffer, // Binary data
    contentType: String // Image type (jpeg, png, etc.)
  },
  personal: {
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    phoneNumber: { type: String },
    alternatePhoneNumber: { type: String },
    personalEmail: { type: String },
    officialEmail: { type: String },
    address: {
      current: addressSchema,
      permanent: addressSchema
    }
  },

  work: {
    empId: { type: String, unique: true }, // Auto-generated if required
    empType: { type: String, enum: ['Permanent', 'Contract', 'Intern'] },
    doj: { type: Date },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Resigned'], default: 'Active' },
    workLocation: { type: String },
    workExperience: {
      years: { type: Number, default: 0 },
      months: { type: Number, default: 0 }
    },
    probationPeriod: { type: Number, default: 0 }, // In months
    designation: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    subDepartment: { type: String }
  },

  team: {
    reportingManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    directReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },

  workweek: workweekSchema,

  resetToken: String,
  resetTokenExpiry: Date

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);

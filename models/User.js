const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, default: null },  
  addressLine2: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
  pincode: { type: String, default: null }
}, { _id: false });

const workweekSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  effectiveDate: { type: Date },
  condition: { type: String, enum: ['1-day week off', '2-days week off'] }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: 'Abc@123' }, // Default password
  role: { type: String, enum: ['HR', 'Manager', 'CEO', 'Employee', 'Intern'], default: 'Intern' },
  profilePic: { type: String },

  personal: {
    dob: { type: Date, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    bloodGroup: { type: String, default: '' },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], default: 'Single' },
    phoneNumber: { type: String, default: '' },
    alternatePhoneNumber: { type: String, default: '' },
    personalEmail: { type: String, default: '' },
    officialEmail: { type: String, default: '' },
    address: {
      current: { type: addressSchema, default: {} },
      permanent: { type: addressSchema, default: {} }
    }
  },

  work: {
    empId: { type: String, unique: true, sparse: true }, // Auto-generated if required
    empType: { type: String, enum: ['Permanent', 'Contract', 'Intern'], default: '' },
    doj: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Resigned'], default: 'Active' },
    workLocation: { type: String, default: '' },
    workExperience: {
      years: { type: Number, default: 0 },
      months: { type: Number, default: 0 }
    },
    probationPeriod: { type: Number, default: 0 }, // In months
    designation: { type: String, default: ''},
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' },
    subDepartment: { type: String, default: '' }
  },

  team: {
    reportingManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    directReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },

  workweek: { type: workweekSchema, default: {} },

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

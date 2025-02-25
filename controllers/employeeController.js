const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ✅ Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find().select('-password'); // Exclude password
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add Employee
const addEmployee = async (req, res) => {
  try {
    const {
      name, email, role, department, subDepartment, jobTitle, designation,
      empId, empType, doj, status, workLocation, workExperience, probationPeriod,
      reportingManagers, directReports, dob, gender, bloodGroup, maritalStatus,
      phoneNumber, alternatePhoneNumber, personalEmail, officialEmail, address, workweek
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash('Abc@123', 10);

    const newEmployee = new User({
      name,
      email,
      password: hashedPassword, // Default password
      role,
      work: { department, subDepartment, jobTitle, designation, empId, empType, doj, status, workLocation, workExperience, probationPeriod },
      team: { reportingManagers, directReports },
      personal: { dob, gender, bloodGroup, maritalStatus, phoneNumber, alternatePhoneNumber, personalEmail, officialEmail, address },
      workweek
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit Employee
const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedEmployee = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await User.findByIdAndDelete(id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile Picture
const updateProfilePic = async (req, res) => {
  try {
    console.log("Received request to update profile pic");
    const userId = req.params.id;
    console.log("User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      console.log("No image uploaded");
      return res.status(400).json({ message: "No image uploaded" });
    }

    console.log("File Received:", req.file);
    user.profilePic = req.file.path;
    await user.save();

    console.log("Profile updated successfully");
    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




module.exports = { getEmployees, getEmployeeById, addEmployee, editEmployee, deleteEmployee, updateProfilePic  };

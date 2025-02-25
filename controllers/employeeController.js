const User = require('../models/User');

// Get all employees (users)
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find().select('-password'); // Exclude password
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Employee (User)
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

    const newEmployee = new User({
      name, email, role, work: { department, subDepartment, jobTitle, designation, empId, empType, doj, status, workLocation, workExperience, probationPeriod },
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

module.exports = { getEmployees, addEmployee };

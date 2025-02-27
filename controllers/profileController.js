const User = require('../models/User');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Profile
exports.editProfile = async (req, res) => {
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

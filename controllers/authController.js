const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET ;

// Sign Up
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password 
// Store OTPs temporarily (in-memory, Redis recommended for production)
const otpStore = new Map(); 
// Generate & Send OTP via Email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com", // ✅ Hostinger SMTP server
        port: 465, // ✅ Use 465 for SSL or 587 for TLS
        secure: true, // ✅ True for SSL
        auth: {
          user: "noreply@prajnansoftwares.com", // ✅ Your Hostinger email
          pass: "Prajnan@312", // ✅ Your Hostinger email password
        },
      });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 mins

    // Save OTP in memory (store in Redis for production)
    otpStore.set(email, { otp, otpExpiry });

    // Send OTP via email
    let mailOptions = {
      from: `<noreply@prajnansoftwares.com>`, // ✅ Custom email sender
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is: ${otp}. It expires in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const storedData = otpStore.get(email);
    if (!storedData) return res.status(400).json({ message: 'OTP expired or not found' });

    if (storedData.otp !== parseInt(otp)) return res.status(400).json({ message: 'Invalid OTP' });

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const storedData = otpStore.get(email);
    if (!storedData || storedData.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash new password & update user
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    // Remove OTP from store
    otpStore.delete(email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
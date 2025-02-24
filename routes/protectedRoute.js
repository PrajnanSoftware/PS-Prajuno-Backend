// routes/protectedRoute.js

const express = require('express');
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected route example
router.get('/protected-route', protect, (req, res) => {
  // This route is only accessible to authenticated users with a valid token
  res.json({ message: 'This is a protected route, accessible only with a valid token.' });
});

module.exports = router;

const express = require('express');
const { getProfile, editProfile } = require('../controllers/profileController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/:id', protect, getProfile);
router.put('/:id', protect, editProfile);

module.exports = router;

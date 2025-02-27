const express = require('express');
const { getProfile, editProfile } = require('../controllers/profileController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/', protect, getProfile);
router.put('/:id', protect, editProfile);

module.exports = router;

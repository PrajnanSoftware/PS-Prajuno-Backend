const express = require('express');
const { getProfile, editProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, editProfile);

module.exports = router;

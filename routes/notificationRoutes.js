const express = require("express");
const { getNotifications, createNotification, markAsRead, clearAllNotifications, deleteNotification} = require('../controllers/notificationController');
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Ensure functions are correctly imported
router.get("/", protect, getNotifications); 
router.post("/", protect, createNotification); 
router.put("/:id/read", protect, markAsRead); 

router.delete("/clear-all", clearAllNotifications); 
router.delete("/:id", deleteNotification);

module.exports = router;

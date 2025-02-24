const express = require("express");
const { getNotifications, createNotification, markAsRead, clearAllNotifications, deleteNotification} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Ensure functions are correctly imported
router.get("/", authMiddleware, getNotifications); 
router.post("/", authMiddleware, createNotification); 
router.put("/:id/read", authMiddleware, markAsRead); 

router.delete("/clear-all", clearAllNotifications); 
router.delete("/:id", deleteNotification);

module.exports = router;

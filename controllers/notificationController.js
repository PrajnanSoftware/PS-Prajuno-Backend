const Notification = require("../models/Notification");

// Fetch notifications for a user
const getNotifications = async (req, res) => {
  try {
    // Fetch all notifications for admin
    const notifications = await Notification.find().sort({ createdAt: -1 });
    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};


// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({ userId, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification" });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id }); // Adjust according to your user model
    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear notifications", error });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error });
  }
};


// Export the functions properly
module.exports = { getNotifications, createNotification, markAsRead, clearAllNotifications, deleteNotification };

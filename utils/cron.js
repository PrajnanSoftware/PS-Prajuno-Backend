const cron = require("node-cron");
const Notification = require("../models/Notification"); // Adjust path as needed
const mongoose = require("mongoose");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running cron job to delete read notifications older than 7 days...");
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const result = await Notification.deleteMany({
      isRead: true, // Only delete read notifications
      createdAt: { $lt: sevenDaysAgo }, // Older than 7 days
    });

    console.log(`Deleted ${result.deletedCount} notifications.`);
  } catch (error) {
    console.error("Error deleting old read notifications:", error);
  }
});

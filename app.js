const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const protectedRoute = require('./routes/protectedRoute');
const emailRoutes = require('./routes/emailRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');
const { Server } = require('socket.io');

require("./utils/cron"); // Import the cron job to start running it

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Default root route
app.get('/', (req, res) => {
  res.send('Welcome to PS Career Dashboard Backend API!'); // You can customize this message
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api', protectedRoute);
app.use("/api/v1/emailRoutes", emailRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// WebSocket for notifications and chat
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});


// Set up Socket.IO with the Express server
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('notification', (data) => {
    io.emit('notification', data);
  });

  socket.on('chat', (data) => {
    io.emit('chat', data);
  });
});

// Export the app as a function for Vercel
module.exports = (req, res) => {
  app(req, res);  // Pass the request and response to the Express app
};

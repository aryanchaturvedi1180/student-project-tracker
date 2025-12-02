// Main Server File - Entry point for the backend application
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const riskRoutes = require('./routes/riskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-project-tracker';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1); // Exit if database connection fails
});

// API Routes
app.use('/api/tasks', taskRoutes); // Task CRUD operations
app.use('/api/risk', riskRoutes); // Risk calculation endpoints
app.use('/api/dashboard', dashboardRoutes); // Dashboard endpoints
app.use('/api/users', userRoutes); // User endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Project Tracker API',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      risk: '/api/risk/project',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


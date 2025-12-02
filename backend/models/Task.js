// Task Model - Stores all project tasks with their details
const mongoose = require('mongoose');

// Define the Task schema with all required fields
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Task title is mandatory
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: '' // Description is optional
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true // Task must be assigned to someone
  },
  deadline: {
    type: Date,
    required: true // Deadline is mandatory for risk calculation
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'], // Only these statuses allowed
    default: 'not-started' // Default status
  },
  progress: {
    type: Number,
    min: 0, // Minimum progress is 0%
    max: 100, // Maximum progress is 100%
    default: 0, // Start at 0%
    required: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the Task model so it can be used in other files
module.exports = mongoose.model('Task', taskSchema);



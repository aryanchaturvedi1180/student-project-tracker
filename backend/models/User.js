// User Model - Stores student, team leader, and project manager information
const mongoose = require('mongoose');

// Define the User schema with required fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
    trim: true // Remove extra spaces
  },
  email: {
    type: String,
    required: true, // Email is mandatory
    unique: true, // Each email should be unique
    trim: true,
    lowercase: true // Store emails in lowercase
  },
  role: {
    type: String,
    required: true, // Role is mandatory
    enum: ['student', 'team-leader', 'project-manager'], // Only these roles allowed
    default: 'student' // Default role if not specified
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the User model so it can be used in other files
module.exports = mongoose.model('User', userSchema);



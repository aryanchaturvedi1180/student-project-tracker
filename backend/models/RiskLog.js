// RiskLog Model - Optional model to store historical risk calculations
const mongoose = require('mongoose');

// Define the RiskLog schema for tracking risk over time
const riskLogSchema = new mongoose.Schema({
  overallRisk: {
    type: Number,
    required: true, // Risk score is mandatory
    min: 0,
    max: 100
  },
  highRiskTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task' // Reference to Task model
  }],
  calculatedAt: {
    type: Date,
    default: Date.now // Timestamp when risk was calculated
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the RiskLog model so it can be used in other files
module.exports = mongoose.model('RiskLog', riskLogSchema);



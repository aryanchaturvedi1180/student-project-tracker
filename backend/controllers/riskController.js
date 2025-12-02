// Risk Controller - Handles risk calculation and early warning endpoints
const Task = require('../models/Task');
const { calculateProjectRisk } = require('../utils/riskCalculator');

/**
 * Get overall project risk assessment
 * Calculates risk for all tasks and returns high-risk tasks
 */
exports.getProjectRisk = async (req, res) => {
  try {
    // Fetch all tasks from database and populate assignedTo with name and role
    const tasks = await Task.find().populate('assignedTo', 'name role');
    
    // Calculate project risk using the risk calculator utility
    const riskData = calculateProjectRisk(tasks);
    
    // Return risk assessment
    res.status(200).json({
      success: true,
      data: {
        overallRisk: riskData.overallRisk,
        highRiskTasks: riskData.highRiskTasks,
        message: riskData.message
      }
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: 'Error calculating project risk',
      error: error.message
    });
  }
};


// Dashboard Controller - Provides summary statistics for the dashboard
const Task = require('../models/Task');
const { calculateProjectRisk } = require('../utils/riskCalculator');

/**
 * Get dashboard statistics
 * Returns total tasks, completed tasks, pending tasks, progress, deadlines, and risk score
 */
exports.getDashboard = async (req, res) => {
  try {
    // Fetch all tasks from database and populate assignedTo with name and role
    const tasks = await Task.find().populate('assignedTo', 'name role');
    
    // Calculate basic statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Calculate overall progress (average of all task progress)
    const overallProgress = totalTasks > 0
      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks)
      : 0;
    
    // Get upcoming deadlines (next 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingDeadlines = tasks
      .filter(task => {
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= sevenDaysFromNow && task.status !== 'completed';
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)) // Sort by deadline (earliest first)
      .slice(0, 5); // Limit to 5 upcoming deadlines
    
    // Calculate overall risk score
    const riskData = calculateProjectRisk(tasks);
    const riskScore = riskData.overallRisk;
    
    // Return dashboard data
    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overallProgress,
        upcomingDeadlines,
        riskScore
      }
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};


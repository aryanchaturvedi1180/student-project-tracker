// Seed Controller - Helper endpoint to check and seed users if needed
const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Check if database has users
 * Returns user count and suggests seeding if empty
 */
exports.checkUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        tasks: taskCount,
        needsSeeding: userCount === 0,
        message: userCount === 0 
          ? 'No users found. Run: npm run seed' 
          : `Found ${userCount} users and ${taskCount} tasks`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking database',
      error: error.message
    });
  }
};



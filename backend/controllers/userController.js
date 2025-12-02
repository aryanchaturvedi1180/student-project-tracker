// User Controller - Handles user-related operations
const User = require('../models/User');

/**
 * Get all users from the database
 * Used for populating user dropdowns in frontend
 * Returns: _id, name, role (required for dropdown)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users with _id, name, and role fields
    const users = await User.find().select('_id name role').sort({ name: 1 }); // Include _id for dropdown value, sort by name
    
    // Log for debugging
    console.log(`[GET /api/users] Total users found: ${users.length}`);
    if (users.length > 0) {
      console.log('Users:', users.map(u => `${u.name} (${u.role})`).join(', '));
    } else {
      console.warn('⚠️  No users found in database! Run: npm run seed');
    }
    
    // Return success response with users (even if empty array)
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      message: users.length === 0 ? 'No users found. Please seed the database.' : undefined
    });
  } catch (error) {
    // Handle errors
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get a single user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};


// Task Controller - Handles all task-related operations (CRUD)
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * Get all tasks from the database
 * Populates the assignedTo field with user details
 * Note: _id is automatically included when populating
 */
exports.getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate user details (name and role, _id is included automatically)
    const tasks = await Task.find().populate('assignedTo', 'name role');
    
    // Log for debugging
    console.log(`Fetched ${tasks.length} tasks`);
    if (tasks.length > 0) {
      console.log('Sample task assignedTo:', tasks[0].assignedTo);
    }
    
    // Return success response with tasks
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

/**
 * Get a single task by ID
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email role');
    
    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

/**
 * Create a new task
 * Validates that assignedTo user exists
 */
exports.createTask = async (req, res) => {
  try {
    // Validate that assignedTo user exists
    const user = await User.findById(req.body.assignedTo);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Create new task with request body data
    const task = await Task.create(req.body);
    
    // Populate user details before sending response
    await task.populate('assignedTo', 'name email role');
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

/**
 * Update an existing task
 */
exports.updateTask = async (req, res) => {
  try {
    // Find and update task, return updated document
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).populate('assignedTo', 'name email role');
    
    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};


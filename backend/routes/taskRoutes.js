// Task Routes - Define all task-related API endpoints
const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', getTaskById);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

// Export router so it can be used in server.js
module.exports = router;



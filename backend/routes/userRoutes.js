// User Routes - Define all user-related API endpoints
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById
} = require('../controllers/userController');
const { checkUsers } = require('../controllers/seedController');

// GET /api/users/check - Check if users exist (helper endpoint)
router.get('/check', checkUsers);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get a single user by ID (must be last to avoid matching 'check')
router.get('/:id', getUserById);

// Export router so it can be used in server.js
module.exports = router;


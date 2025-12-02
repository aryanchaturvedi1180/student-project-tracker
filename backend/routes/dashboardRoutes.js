// Dashboard Routes - Define dashboard API endpoints
const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');

// GET /api/dashboard - Get dashboard statistics
router.get('/', getDashboard);

// Export router so it can be used in server.js
module.exports = router;



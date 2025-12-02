// Risk Routes - Define all risk-related API endpoints
const express = require('express');
const router = express.Router();
const { getProjectRisk } = require('../controllers/riskController');

// GET /api/risk/project - Get overall project risk assessment
router.get('/project', getProjectRisk);

// Export router so it can be used in server.js
module.exports = router;



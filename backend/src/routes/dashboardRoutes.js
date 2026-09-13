const express = require('express');
const router = express.Router();
const { getStats, getChartsData, getRecentActivities } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/charts', getChartsData);
router.get('/activities', getRecentActivities);

module.exports = router;

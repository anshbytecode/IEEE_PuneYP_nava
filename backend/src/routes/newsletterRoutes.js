const express = require('express');
const router = express.Router();
const { getSubscribers, exportCSV, subscribe } = require('../controllers/newsletterController');
const { authMiddleware } = require('../middleware/auth');

// Public endpoints
router.post('/subscribe', subscribe);

// Protected admin endpoints
router.use(authMiddleware);

router.get('/', getSubscribers);
router.get('/export', exportCSV);

module.exports = router;

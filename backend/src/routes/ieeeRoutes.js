const express = require('express');
const router = express.Router();
const {
  getOrganizationBySpoid,
  getOrganizationEventsHandler,
  getOrganizationTimelineHandler,
  triggerSync,
  getEventSourcesHandler
} = require('../controllers/ieeeController');
const { authMiddleware } = require('../middleware/auth');

// Public endpoints (spec Section 31)
router.get('/organizations/:spoid', getOrganizationBySpoid);
router.get('/organizations/:spoid/events', getOrganizationEventsHandler);
router.get('/organizations/:spoid/timeline', getOrganizationTimelineHandler);
router.get('/events/:eventId/sources', getEventSourcesHandler);

// Protected endpoints (sync should require auth in production)
router.post('/sync/:spoid', authMiddleware, triggerSync);

module.exports = router;

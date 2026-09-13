const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventRegistrations, registerForEvent } = require('../controllers/eventController');
const { authMiddleware } = require('../middleware/auth');
const { uploadEventFiles, validateFileSizes } = require('../middleware/upload');

// Public endpoints (if public website queries them, otherwise also works here)
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/register', registerForEvent);

// Protected endpoints
router.post('/', authMiddleware, uploadEventFiles, validateFileSizes, createEvent);
router.put('/:id', authMiddleware, uploadEventFiles, validateFileSizes, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.get('/:id/registrations', authMiddleware, getEventRegistrations);

module.exports = router;

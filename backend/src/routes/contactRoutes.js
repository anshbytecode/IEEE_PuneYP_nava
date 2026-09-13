const express = require('express');
const router = express.Router();
const { getContacts, resolveContact, createContact } = require('../controllers/contactController');
const { authMiddleware } = require('../middleware/auth');

// Protected endpoints
router.post('/', createContact);

// Protected admin endpoints
router.use(authMiddleware);

router.get('/', getContacts);
router.put('/:id/resolve', resolveContact);

module.exports = router;

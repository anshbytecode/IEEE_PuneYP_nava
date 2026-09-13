const express = require('express');
const router = express.Router();
const {
  getGrants,
  getGrantById,
  createGrant,
  updateGrant,
  deleteGrant,
} = require('../controllers/grantController');
const { authMiddleware } = require('../middleware/auth');

// Public Routes
router.get('/', getGrants);
router.get('/:id', getGrantById);

// Admin Protected Routes
router.post('/', authMiddleware, createGrant);
router.put('/:id', authMiddleware, updateGrant);
router.delete('/:id', authMiddleware, deleteGrant);

module.exports = router;

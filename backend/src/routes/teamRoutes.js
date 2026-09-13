const express = require('express');
const router = express.Router();
const { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  reorderTeam,
  getChairMessage,
  updateChairMessage
} = require('../controllers/teamController');
const { authMiddleware } = require('../middleware/auth');
const { uploadTeamFiles, validateFileSizes } = require('../middleware/upload');

// Public routes
router.get('/', getTeamMembers);
router.get('/chair-message', getChairMessage);

// Protected routes
router.put('/chair-message', authMiddleware, updateChairMessage);
router.post('/', authMiddleware, uploadTeamFiles, validateFileSizes, createTeamMember);
router.put('/reorder', authMiddleware, reorderTeam);
router.put('/:id', authMiddleware, uploadTeamFiles, validateFileSizes, updateTeamMember);
router.delete('/:id', authMiddleware, deleteTeamMember);

module.exports = router;

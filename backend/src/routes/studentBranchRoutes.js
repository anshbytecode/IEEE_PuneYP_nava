const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { uploadBranchFiles, validateFileSizes } = require('../middleware/upload');
const {
  getStudentBranches,
  getStudentBranchById,
  createStudentBranch,
  updateStudentBranch,
  deleteStudentBranch
} = require('../controllers/studentBranchController');

// Public endpoints
router.get('/', getStudentBranches);
router.get('/:id', getStudentBranchById);

// Admin-only endpoints
router.post('/', authMiddleware, uploadBranchFiles, validateFileSizes, createStudentBranch);
router.put('/:id', authMiddleware, uploadBranchFiles, validateFileSizes, updateStudentBranch);
router.delete('/:id', authMiddleware, deleteStudentBranch);

module.exports = router;

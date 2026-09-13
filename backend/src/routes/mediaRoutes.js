const express = require('express');
const router = express.Router();
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { authMiddleware } = require('../middleware/auth');
const { uploadMediaLibraryFiles, validateFileSizes } = require('../middleware/upload');

// Public endpoints
router.get('/', getMedia);

// Protected routes (media gallery dashboard operations)
router.post('/upload', authMiddleware, uploadMediaLibraryFiles, validateFileSizes, uploadMedia);
router.delete('/:id', authMiddleware, deleteMedia);

module.exports = router;

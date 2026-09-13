const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/auth');
const { uploadBlogFiles, validateFileSizes } = require('../middleware/upload');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', authMiddleware, uploadBlogFiles, validateFileSizes, createBlog);
router.put('/:id', authMiddleware, uploadBlogFiles, validateFileSizes, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;

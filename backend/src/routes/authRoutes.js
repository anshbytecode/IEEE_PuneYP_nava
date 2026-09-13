const express = require('express');
const router = express.Router();
const { login, getMe, signup, googleAuth } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', login);
router.post('/signup', signup);
router.post('/google', googleAuth);
router.get('/me', authMiddleware, getMe);

module.exports = router;


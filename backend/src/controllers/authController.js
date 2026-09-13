const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Query admin using Prisma
    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password hash before returning
    const adminResponse = { ...admin };
    delete adminResponse.passwordHash;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: adminResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login. Please try again.' });
  }
};

const getMe = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    return res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile details.' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.endsWith('@ieee.org') && !trimmedEmail.endsWith('@ieeepune.org')) {
      return res.status(400).json({ success: false, message: 'Only @ieee.org and @ieeepune.org emails are authorized to register as administrators.' });
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: trimmedEmail }
    });

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email is already registered. Please sign in.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: trimmedEmail,
        passwordHash: hashedPassword,
        role: 'admin' // default role
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const adminResponse = { ...newAdmin };
    delete adminResponse.passwordHash;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      admin: adminResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during sign up. Please try again.' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    let email = '';
    let name = '';

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    // Check for mock fallback when credential is 'mock-google-token' or GOOGLE_CLIENT_ID is not configured
    if (credential === 'mock-google-token' || !googleClientId) {
      console.log('Using Mock Google Auth verification.');
      email = 'developer@ieeepune.org';
      name = 'IEEE Developer';
    } else {
      // Verify Google Token via Tokeninfo API
      try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!response.ok) {
          return res.status(400).json({ success: false, message: 'Invalid Google token.' });
        }
        const payload = await response.json();
        
        // Check audience if client ID is configured
        if (googleClientId && payload.aud !== googleClientId) {
          return res.status(400).json({ success: false, message: 'Google client ID mismatch.' });
        }

        email = payload.email;
        name = payload.name || payload.given_name || 'Google User';
      } catch (err) {
        console.error('Google token verification failed:', err);
        return res.status(400).json({ success: false, message: 'Google token verification failed.' });
      }
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.endsWith('@ieee.org') && !trimmedEmail.endsWith('@ieeepune.org')) {
      return res.status(400).json({ success: false, message: 'Only @ieee.org and @ieeepune.org Google accounts are authorized to access the admin portal.' });
    }

    // Find or create admin
    let admin = await prisma.admin.findUnique({
      where: { email: trimmedEmail }
    });

    if (!admin) {
      console.log(`Google user ${trimmedEmail} not found in DB. Auto-registering...`);
      // Create a random password since they use Google login
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      admin = await prisma.admin.create({
        data: {
          name: name,
          email: trimmedEmail,
          passwordHash: hashedPassword,
          role: 'admin'
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const adminResponse = { ...admin };
    delete adminResponse.passwordHash;

    return res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token,
      admin: adminResponse
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    return res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

module.exports = {
  login,
  getMe,
  signup,
  googleAuth
};


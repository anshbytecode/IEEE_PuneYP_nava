const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Adjust to specific frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Health check & Root endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'IEEE Pune Section YP Backend API is running.',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      team: '/api/team',
      blogs: '/api/blogs',
      announcements: '/api/announcements'
    },
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'OK', timestamp: new Date() });
});

// Import Router modules
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const eventRoutes = require('./routes/eventRoutes');
const teamRoutes = require('./routes/teamRoutes');
const blogRoutes = require('./routes/blogRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const studentBranchRoutes = require('./routes/studentBranchRoutes');
const grantRoutes = require('./routes/grantRoutes');
const ieeeRoutes = require('./routes/ieeeRoutes');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/student-branches', studentBranchRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/ieee', ieeeRoutes);

// Fallback 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler caught:', err);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;

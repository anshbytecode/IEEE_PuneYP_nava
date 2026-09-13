const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Initialize single Prisma Client instance (similar to Hibernate SessionFactory)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

module.exports = prisma;

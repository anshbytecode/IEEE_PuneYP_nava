const app = require('./app');
const seedDb = require('./config/seed');
const { startScheduledJobs } = require('./services/cronService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Run Database Seeding
    await seedDb();
    
    // Start Listening
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`  IEEE YP CMS Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`  Local Endpoint: http://localhost:${PORT}`);
      console.log(`========================================`);

      // Start vTools sync scheduler (initial sync fires 10s after boot, then every 6h)
      startScheduledJobs();
    });
  } catch (error) {
    console.error('Fatal error starting the backend server:', error);
    process.exit(1);
  }
};

startServer();


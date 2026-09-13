const { syncVtoolsEvents } = require('./vtoolsService');

// Sync interval: 6 hours for daily sync, per spec Section 32
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

// Primary SPOID to sync
const IEEE_PRIMARY_SPOID = process.env.IEEE_PRIMARY_SPOID || 'YP00120';

function startScheduledJobs() {
  console.log(`[Scheduler] Initializing automated vTools sync worker for SPOID: ${IEEE_PRIMARY_SPOID}...`);
  
  // Initial sync attempt on server boot
  setTimeout(async () => {
    try {
      const result = await syncVtoolsEvents(IEEE_PRIMARY_SPOID);
      console.log(`[Scheduler] Initial sync completed — status: ${result.status}, synced: ${result.synced}/${result.total}`);
    } catch (err) {
      console.error('[Scheduler] Initial vTools sync failed:', err.message);
    }
  }, 10000); // 10s after server start

  // Periodic interval loop (spec Section 32: daily for upcoming, weekly for full)
  setInterval(async () => {
    try {
      console.log(`[Scheduler] Executing scheduled vTools sync for SPOID: ${IEEE_PRIMARY_SPOID}...`);
      const result = await syncVtoolsEvents(IEEE_PRIMARY_SPOID);
      console.log(`[Scheduler] Scheduled sync completed — status: ${result.status}, synced: ${result.synced}/${result.total}`);
    } catch (err) {
      console.error('[Scheduler] Scheduled vTools sync error:', err.message);
    }
  }, SYNC_INTERVAL_MS);
}

module.exports = {
  startScheduledJobs
};

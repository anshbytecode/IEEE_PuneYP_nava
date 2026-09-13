const {
  getOrganization,
  getOrganizationEvents,
  getOrganizationTimeline,
  getEventSources,
  syncVtoolsEvents
} = require('../services/vtoolsService');

/**
 * GET /api/ieee/organizations/:spoid
 * Get organization details by SPOID.
 */
const getOrganizationBySpoid = async (req, res) => {
  try {
    const { spoid } = req.params;
    const org = await getOrganization(spoid);
    
    if (!org) {
      return res.status(404).json({
        success: false,
        message: `Organization with SPOID ${spoid} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      organization: {
        id: org.externalId,
        name: org.canonicalName,
        officialName: org.officialName,
        type: org.organizationType,
        parentSection: org.parentSection,
        city: org.city,
        country: org.country,
        active: org.active
      }
    });
  } catch (error) {
    console.error('Get organization error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve organization.' });
  }
};

/**
 * GET /api/ieee/organizations/:spoid/events
 * Get events for an organization with optional date range and category filtering.
 * Query params: from, to (year), category, page, limit
 */
const getOrganizationEventsHandler = async (req, res) => {
  try {
    const { spoid } = req.params;
    const { from, to, category, page = 1, limit = 50 } = req.query;

    const result = await getOrganizationEvents(spoid, { from, to, category, page, limit });

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: result.error
      });
    }

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get organization events error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve organization events.' });
  }
};

/**
 * GET /api/ieee/organizations/:spoid/timeline
 * Get a timeline of events grouped by year.
 */
const getOrganizationTimelineHandler = async (req, res) => {
  try {
    const { spoid } = req.params;
    const result = await getOrganizationTimeline(spoid);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Organization with SPOID ${spoid} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get organization timeline error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve organization timeline.' });
  }
};

/**
 * POST /api/ieee/sync/:spoid
 * Trigger a manual sync for a specific organization.
 */
const triggerSync = async (req, res) => {
  try {
    const { spoid } = req.params;
    console.log(`[IEEE API] Manual sync triggered for SPOID: ${spoid}`);

    const result = await syncVtoolsEvents(spoid);

    // Per spec Section 33: report actual status, never false success on API failure
    return res.status(200).json({
      success: result.success,
      status: result.status,
      message: result.status === 'partial'
        ? `Sync completed with warnings. ${result.synced}/${result.total} events synced.`
        : `Sync completed successfully. ${result.synced}/${result.total} events synced.`,
      total: result.total,
      synced: result.synced,
      errors: result.errors || undefined
    });
  } catch (error) {
    console.error('Sync error:', error);
    // Per spec Section 33: never silently return empty on failure
    return res.status(500).json({
      success: false,
      status: 'failed',
      message: 'Sync failed: ' + error.message,
      error: error.message
    });
  }
};

/**
 * GET /api/ieee/events/:eventId/sources
 * Get source evidence for a specific event.
 */
const getEventSourcesHandler = async (req, res) => {
  try {
    const { eventId } = req.params;
    const sources = await getEventSources(eventId);

    return res.status(200).json({
      success: true,
      eventId,
      sources: sources.map(s => ({
        id: s.id,
        sourceType: s.sourceType,
        sourceUrl: s.sourceUrl,
        sourceTitle: s.sourceTitle,
        retrievedAt: s.retrievedAt,
        contentHash: s.contentHash
      }))
    });
  } catch (error) {
    console.error('Get event sources error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve event sources.' });
  }
};

module.exports = {
  getOrganizationBySpoid,
  getOrganizationEventsHandler,
  getOrganizationTimelineHandler,
  triggerSync,
  getEventSourcesHandler
};

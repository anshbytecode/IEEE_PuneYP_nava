const prisma = require('../config/prisma');
const crypto = require('crypto');

// ─── Configuration ──────────────────────────────────────────────────────────
const VTOOLS_API_BASE = process.env.VTOOLS_API_BASE || 'https://events.vtools.ieee.org/RST/events/api/public/v8';
const VTOOLS_FEED_UID = process.env.VTOOLS_FEED_UID || '';
const IEEE_PRIMARY_SPOID = process.env.IEEE_PRIMARY_SPOID || 'YP00120';

// Target IEEE YP Pune Section SPOIDs & Host Identifiers
const PUNE_SPOIDS = ['YP00120', 'SBC18461A', 'R00120'];
const PUNE_ORG_ALIASES = [
  'ieee yp pune',
  'ieee young professionals pune',
  'pune section affinity group, yp',
  'ieee pune section yp',
  'yp00120',
  'sbc18461a',
  'r00120'
];

// Organization configuration per spec Section 6
const ORG_CONFIGS = {
  YP00120: {
    externalId: 'YP00120',
    externalIdType: 'IEEE_SPOID',
    canonicalName: 'IEEE Young Professionals Pune',
    officialName: 'Pune Section Affinity Group, YP',
    organizationType: 'AFFINITY_GROUP',
    parentSection: 'IEEE Pune Section',
    city: 'Pune',
    country: 'India'
  },
  SBC18461A: {
    externalId: 'SBC18461A',
    externalIdType: 'IEEE_SPOID',
    canonicalName: 'IEEE Pune Student Branch Chapters',
    officialName: 'Pune Student Branch Chapter',
    organizationType: 'STUDENT_BRANCH',
    parentSection: 'IEEE Pune Section',
    city: 'Pune',
    country: 'India'
  },
  R00120: {
    externalId: 'R00120',
    externalIdType: 'IEEE_SPOID',
    canonicalName: 'IEEE Pune Section',
    officialName: 'IEEE Pune Section',
    organizationType: 'SECTION',
    parentSection: null,
    city: 'Pune',
    country: 'India'
  }
};

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string to produce plain text.
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

/**
 * Extract the first https image URL from an HTML string.
 * Used as a fallback bannerUrl when vTools doesn't provide an explicit banner field.
 */
function extractFirstImageFromHtml(html) {
  if (!html) return '';
  const match = html.match(/src=["'](https:\/\/[^"']+)["']/);
  return match ? match[1] : '';
}

/**
 * Normalize a raw vTools category string into one of 5 canonical values
 * that exactly match the CATEGORY_COLORS map in ActivitiesPage.tsx:
 *   Technical | Networking | Leadership | Workshop | Flagship
 */
function mapCategory(rawCat) {
  if (!rawCat) return 'Technical';
  const c = String(rawCat).toLowerCase();

  if (c.includes('flagship') || c.includes('summit') || c.includes('annual') || c.includes('congress') || c.includes('gala')) {
    return 'Flagship';
  }
  if (c.includes('network') || c.includes('social') || c.includes('meetup') || c.includes('mixer') || c.includes('connect') || c.includes('industry')) {
    return 'Networking';
  }
  if (c.includes('skill') || c.includes('soft') || c.includes('career') || c.includes('professional') || c.includes('leadership') || c.includes('women') || c.includes('elevat')) {
    return 'Leadership';
  }
  if (c.includes('step') || c.includes('student') || c.includes('transition') || c.includes('workshop') || c.includes('hands') || c.includes('embedded') || c.includes('iot') || c.includes('tech talk') || c.includes('masterclass') || c.includes('training')) {
    return 'Workshop';
  }
  // default
  return 'Technical';
}

/**
 * Normalize a title for deduplication comparison (Section 17).
 * Strips punctuation, lowercases, collapses whitespace.
 */
function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')    // remove punctuation
    .replace(/\s+/g, ' ')      // collapse whitespace
    .trim();
}

/**
 * Compute a simple content hash for source evidence dedup.
 */
function computeContentHash(content) {
  return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex').slice(0, 16);
}

/**
 * Sanitize a string for SQLite storage.
 * Strips problematic hex escape sequences, null bytes, and other characters
 * that SQLite/Prisma cannot handle correctly.
 */
function sanitizeForSqlite(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/\\x[0-9a-fA-F]{2}/gi, '')           // remove valid hex escapes \xNN
    .replace(/\\x/gi, 'x')                        // replace any raw \x sequence with 'x'
    .replace(/\\u0000/g, '')                      // remove \u0000 null sequences
    .replace(/\\u(?![0-9a-fA-F]{4})/gi, '')       // remove invalid/incomplete \u escapes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // remove binary control chars (keep \t \n \r)
    .replace(/\0/g, '');                          // remove any remaining null bytes
}

/**
 * Calculate simple title similarity (Jaccard index on word sets).
 */
function titleSimilarity(a, b) {
  const wordsA = new Set(normalizeTitle(a).split(' '));
  const wordsB = new Set(normalizeTitle(b).split(' '));
  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─── Static Fallback Events ────────────────────────────────────────────────
/**
 * Static IEEE YP Pune Section fallback events (YP00120, SBC18461A, R00120).
 * Categories are now aligned to the 5 canonical frontend values.
 * These are always merged with live vTools API results.
/**
 * Static fallback events list — kept empty so only authentic live IEEE vTools API events are used.
 */
const IEEE_YP_PUNE_EVENTS = [];

// ─── Relationship Classification (Section 16) ──────────────────────────────

/**
 * Classify the relationship between a vTools event and our target SPOIDs.
 * Returns { spoid, relationshipType, confidence, evidence } or null.
 * 
 * Evidence hierarchy (spec Section 16):
 *   Level 1 — Explicit SPOID match (primary host)  → confidence 1.00
 *   Level 2 — Explicit org name match               → confidence 0.95
 *   Level 3 — Co-host SPOID match                   → confidence 0.95
 *   Level 4 — Sponsor mention in description         → confidence 0.90
 *   Level 5 — Supporter/partner mention              → confidence 0.80
 *   Level 6 — Keyword-only mention (DO NOT auto-associate) → null
 */
function classifyRelationship(item) {
  const attrs = item.attributes || {};
  const primaryHost = attrs['primary-host'] || {};
  const cohosts = attrs.cohosts || [];

  const hostSpoid = String(primaryHost.spoid || '').toUpperCase();
  const sectionSpoids = String(primaryHost.section_spoids || '').toUpperCase();
  const hostName = String(primaryHost.name || '').toLowerCase();

  // Level 1 — Primary host SPOID exact match
  for (const sp of PUNE_SPOIDS) {
    if (hostSpoid === sp || hostSpoid.includes(sp)) {
      return {
        spoid: sp,
        relationshipType: 'PRIMARY_HOST',
        confidence: 1.0,
        evidence: `primary-host.spoid matches ${sp}`
      };
    }
    if (sectionSpoids.includes(sp)) {
      return {
        spoid: sp,
        relationshipType: 'PRIMARY_HOST',
        confidence: 1.0,
        evidence: `primary-host.section_spoids includes ${sp}`
      };
    }
  }

  // Level 2 — Explicit organization name match in primary host
  for (const alias of PUNE_ORG_ALIASES) {
    if (hostName.includes(alias)) {
      return {
        spoid: IEEE_PRIMARY_SPOID,
        relationshipType: 'PRIMARY_HOST',
        confidence: 0.95,
        evidence: `primary-host.name contains "${alias}"`
      };
    }
  }

  // Level 3 — Co-host SPOID match
  for (const ch of cohosts) {
    const chSpoid = String(ch.spoid || '').toUpperCase();
    const chSec = String(ch.section_spoids || '').toUpperCase();
    for (const sp of PUNE_SPOIDS) {
      if (chSpoid === sp || chSpoid.includes(sp) || chSec.includes(sp)) {
        return {
          spoid: sp,
          relationshipType: 'COHOST',
          confidence: 0.95,
          evidence: `cohost.spoid matches ${sp}`
        };
      }
    }
  }

  // Level 4 — Sponsor mention in description/title
  const descText = `${attrs.title || ''} ${attrs.description || ''}`.toLowerCase();
  for (const alias of PUNE_ORG_ALIASES) {
    if (descText.includes(`sponsored by ${alias}`) || descText.includes(`sponsor: ${alias}`)) {
      return {
        spoid: IEEE_PRIMARY_SPOID,
        relationshipType: 'SPONSOR',
        confidence: 0.90,
        evidence: `Description mentions sponsorship by "${alias}"`
      };
    }
  }

  // Level 5 — Supporter/partner mention
  for (const alias of PUNE_ORG_ALIASES) {
    if (descText.includes(`supported by ${alias}`) || descText.includes(`partner: ${alias}`) || descText.includes(`in association with ${alias}`)) {
      return {
        spoid: IEEE_PRIMARY_SPOID,
        relationshipType: 'SUPPORTER',
        confidence: 0.80,
        evidence: `Description mentions support/partnership with "${alias}"`
      };
    }
  }

  // Level 6 — Keyword-only mention → do NOT auto-associate (spec Section 16)
  // Check city + text for informational purposes but return with UNKNOWN if explicitly needed
  const fullText = `${descText} ${attrs.city || ''} ${hostName}`.toLowerCase();
  const hasKeywordMatch = PUNE_ORG_ALIASES.some(kw => fullText.includes(kw));
  if (hasKeywordMatch) {
    return {
      spoid: IEEE_PRIMARY_SPOID,
      relationshipType: 'UNKNOWN',
      confidence: 0.50,
      evidence: 'Keyword-only mention found in text; requires manual verification'
    };
  }

  return null;
}

// ─── API Retrieval (Paginated — Section 12) ─────────────────────────────────

/**
 * Fetch a single page from a vTools API URL. Returns { data, included, meta }.
 */
async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      const status = response.status;
      console.warn(`[vTools API] HTTP ${status} from: ${url}`);
      // Per spec Section 33: distinguish error types
      if (status === 429) throw new Error(`Rate limited (HTTP 429)`);
      if (status === 400) throw new Error(`Bad request (HTTP 400) — SPOID filter may require custom feed`);
      if (status >= 500) throw new Error(`Server error (HTTP ${status})`);
      throw new Error(`HTTP ${status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out (15s)');
    }
    throw err;
  }
}

/**
 * Fetch ALL pages from vTools API with automatic pagination (spec Section 12).
 * Never assume page 1 contains all events.
 * 
 * @param {string} baseUrl - API URL without page param
 * @returns {{ items: Array, error: string|null }}
 */
async function fetchAllPages(baseUrl) {
  let page = 1;
  let allItems = [];
  let allIncluded = [];
  let error = null;

  try {
    while (true) {
      const separator = baseUrl.includes('?') ? '&' : '?';
      const url = `${baseUrl}${separator}page=${page}`;
      console.log(`[vTools API] Fetching page ${page}: ${url}`);

      const data = await fetchPage(url);

      if (data && data.data && Array.isArray(data.data)) {
        allItems = allItems.concat(data.data);
      }
      if (data && Array.isArray(data.included)) {
        allIncluded = allIncluded.concat(data.included);
      }

      // Check pagination metadata (spec Section 12)
      const paging = (data && data.meta && data.meta.paging) || {};
      const totalPages = paging.total_pages || paging.totalPages || page;

      console.log(`[vTools API] Page ${page}/${totalPages} — ${(data.data || []).length} items this page, ${allItems.length} total so far`);

      if (page >= totalPages) break;
      page++;

      // Safety: max 50 pages to prevent runaway loops
      if (page > 50) {
        console.warn('[vTools API] Hit 50-page safety limit, stopping pagination');
        break;
      }
    }
  } catch (err) {
    error = err.message;
    console.error(`[vTools API] Pagination error on page ${page}:`, err.message);
  }

  return { items: allItems, included: allIncluded, error };
}

// ─── Event Parsing ──────────────────────────────────────────────────────────

/**
 * Parse a single vTools API event item into our normalized DB shape.
 */
function parseVtoolsEvent(item, includedMap) {
  const attrs = item.attributes || {};
  const rels = item.relationships || {};
  const primaryHost = attrs['primary-host'] || {};

  const vtoolsId = String(item.id || attrs.id);
  const title = attrs.title || attrs.name || 'IEEE YP Event';

  const rawDesc = sanitizeForSqlite(attrs.description || attrs.summary || '');
  const fullDescription = rawDesc || title;
  const shortDescription = stripHtml(rawDesc).slice(0, 240) || 'IEEE Young Professionals Pune Section Event.';

  const startDateStr = attrs['start-time'] || attrs.startTime || attrs['start_time'] || new Date().toISOString();
  const eventDate = new Date(startDateStr);

  // Compose venue string from available location fields
  const city = attrs.city || 'Pune';
  const address1 = attrs.address1 || attrs.address || '';
  const building = attrs.building || '';
  const venueParts = [building, address1, city].filter(Boolean);
  const hostName = primaryHost.name || 'IEEE YP Pune Section';
  const venue = venueParts.length > 0 ? venueParts.join(', ') : `${hostName}, Pune`;

  const registrationLink = attrs.link || attrs['registration-url'] || attrs.registrationUrl || `https://events.vtools.ieee.org/m/${vtoolsId}`;

  // Resolve category from included relationship or direct attribute
  let categoryName = 'Technical';
  if (rels.category && rels.category.data) {
    const catInc = includedMap.get(`category_${rels.category.data.id}`);
    if (catInc && catInc.attributes && catInc.attributes.name) {
      categoryName = catInc.attributes.name;
    }
  } else if (attrs.category) {
    categoryName = String(attrs.category);
  }

  // Always recompute status from event date, never trust stale vTools status
  const status = eventDate < new Date() ? 'Completed' : 'Upcoming';

  // Use vTools banner if available; fallback to extracting first image from description HTML
  const bannerUrl =
    attrs['banner-url'] ||
    attrs['image-url'] ||
    attrs['photo-url'] ||
    attrs.image ||
    attrs['thumbnail-url'] ||
    extractFirstImageFromHtml(rawDesc) ||
    '';

  // Classify relationship with our target SPOIDs
  const relationship = classifyRelationship(item);

  return {
    vtoolsId,
    title,
    shortDescription,
    fullDescription,
    bannerUrl,
    galleryUrls: '[]',
    eventDate,
    venue,
    registrationLink,
    sdgAlignment: '[]',
    category: mapCategory(categoryName),
    status,
    isDeleted: false,
    rawData: sanitizeForSqlite(JSON.stringify(item)),
    _relationship: relationship,
    _sourceUrl: `https://events.vtools.ieee.org/m/${vtoolsId}`
  };
}

// ─── Organization Management ────────────────────────────────────────────────

/**
 * Ensure organization records exist in the DB for our target SPOIDs.
 */
async function ensureOrganizations() {
  const orgIds = {};
  for (const [spoid, config] of Object.entries(ORG_CONFIGS)) {
    try {
      const org = await prisma.organization.upsert({
        where: { externalId: spoid },
        update: {
          canonicalName: config.canonicalName,
          officialName: config.officialName,
          organizationType: config.organizationType,
          parentSection: config.parentSection,
          city: config.city,
          country: config.country
        },
        create: {
          externalId: config.externalId,
          externalIdType: config.externalIdType,
          canonicalName: config.canonicalName,
          officialName: config.officialName,
          organizationType: config.organizationType,
          parentSection: config.parentSection,
          city: config.city,
          country: config.country
        }
      });
      orgIds[spoid] = org.id;
    } catch (err) {
      console.error(`[vTools Sync] Failed to upsert organization ${spoid}:`, err.message);
    }
  }
  return orgIds;
}

// ─── Event Deduplication (Section 17-18) ────────────────────────────────────

/**
 * Deduplicate events by:
 *   1. Exact vtoolsId match (live API wins over static)
 *   2. Title similarity + date proximity + same city (for cross-source dedup)
 */
function deduplicateEvents(events) {
  const uniqueMap = new Map();

  for (const evt of events) {
    // Primary dedup: by vtoolsId
    if (uniqueMap.has(evt.vtoolsId)) {
      const existing = uniqueMap.get(evt.vtoolsId);
      // Live API data (with rawData) wins over static seed data
      if (evt.rawData && !existing.rawData) {
        uniqueMap.set(evt.vtoolsId, evt);
      }
      continue;
    }

    // Secondary dedup: title similarity + date proximity (spec Section 17)
    let isDup = false;
    for (const [, existing] of uniqueMap) {
      const sim = titleSimilarity(evt.title, existing.title);
      const dateDiffDays = Math.abs(evt.eventDate - existing.eventDate) / (1000 * 60 * 60 * 24);
      const sameCity = (evt.venue || '').toLowerCase().includes('pune') &&
                       (existing.venue || '').toLowerCase().includes('pune');
      
      if (sim > 0.90 && dateDiffDays <= 1 && sameCity) {
        // Merge: keep the one with more data
        isDup = true;
        console.log(`[vTools Sync] Dedup: "${evt.title}" ≈ "${existing.title}" (similarity: ${sim.toFixed(2)})`);
        break;
      }
    }

    if (!isDup) {
      uniqueMap.set(evt.vtoolsId, evt);
    }
  }

  return Array.from(uniqueMap.values());
}

// ─── DB Operations ──────────────────────────────────────────────────────────

/**
 * Upsert a single event into the DB.
 * Also creates OrganizationEvent relationship and EventSource records.
 */
async function safeUpsert(evt, orgIds) {
  try {
    const recomputedStatus = evt.eventDate < new Date() ? 'Completed' : 'Upcoming';

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 5000)
    );

    const upsertPromise = prisma.event.upsert({
      where: { vtoolsId: evt.vtoolsId },
      update: {
        title: sanitizeForSqlite(evt.title),
        shortDescription: sanitizeForSqlite(evt.shortDescription),
        fullDescription: sanitizeForSqlite(evt.fullDescription),
        bannerUrl: evt.bannerUrl,
        eventDate: evt.eventDate,
        venue: sanitizeForSqlite(evt.venue),
        registrationLink: evt.registrationLink,
        category: evt.category,
        status: recomputedStatus,
        isDeleted: false,
        rawData: sanitizeForSqlite(evt.rawData) || null,
        updatedAt: new Date()
      },
      create: {
        vtoolsId: evt.vtoolsId,
        title: sanitizeForSqlite(evt.title),
        shortDescription: sanitizeForSqlite(evt.shortDescription),
        fullDescription: sanitizeForSqlite(evt.fullDescription),
        bannerUrl: evt.bannerUrl,
        galleryUrls: evt.galleryUrls,
        eventDate: evt.eventDate,
        venue: sanitizeForSqlite(evt.venue),
        registrationLink: evt.registrationLink,
        sdgAlignment: evt.sdgAlignment,
        category: evt.category,
        status: recomputedStatus,
        rawData: sanitizeForSqlite(evt.rawData) || null
      }
    });

    const savedEvent = await Promise.race([upsertPromise, timeoutPromise]);

    // Create organization-event relationship (spec Section 8)
    const rel = evt._relationship;
    if (rel && orgIds) {
      const targetSpoid = rel.spoid || rel._spoid || IEEE_PRIMARY_SPOID;
      const orgId = orgIds[targetSpoid];
      if (orgId) {
        try {
          await prisma.organizationEvent.upsert({
            where: {
              organizationId_eventId_relationshipType: {
                organizationId: orgId,
                eventId: savedEvent.id,
                relationshipType: rel.relationshipType || rel._relationship || 'UNKNOWN'
              }
            },
            update: {
              confidence: rel.confidence || rel._confidence || 0.0,
              evidence: rel.evidence || null
            },
            create: {
              organizationId: orgId,
              eventId: savedEvent.id,
              relationshipType: rel.relationshipType || rel._relationship || 'UNKNOWN',
              confidence: rel.confidence || rel._confidence || 0.0,
              sourceUrl: evt._sourceUrl || null,
              evidence: rel.evidence || null
            }
          });
        } catch (relErr) {
          console.warn(`[vTools Sync] Relationship upsert failed for ${evt.vtoolsId}:`, relErr.message);
        }
      }
    }

    // Create event source record (spec Section 9)
    const sourceType = evt._source === 'STATIC_SEED' ? 'STATIC_SEED' : 'VTOOLS_API';
    const sourceUrl = evt._sourceUrl || `https://events.vtools.ieee.org/m/${evt.vtoolsId}`;
    try {
      const existingSource = await prisma.eventSource.findFirst({
        where: {
          eventId: savedEvent.id,
          sourceType,
          sourceUrl
        }
      });
      if (!existingSource) {
        await prisma.eventSource.create({
          data: {
            eventId: savedEvent.id,
            sourceType,
            sourceUrl,
            sourceTitle: evt.title,
            contentHash: computeContentHash(evt),
            rawContent: evt.rawData || null
          }
        });
      }
    } catch (srcErr) {
      console.warn(`[vTools Sync] Source record failed for ${evt.vtoolsId}:`, srcErr.message);
    }

    return true;
  } catch (err) {
    console.warn('[vTools Sync] Upsert failed for:', evt.vtoolsId, '-', err.message);
    return false;
  }
}

// ─── Sync State Management (Section 13) ─────────────────────────────────────

/**
 * Get the last successful sync timestamp for an organization.
 */
async function getLastSyncTime(orgId) {
  try {
    const state = await prisma.syncState.findUnique({
      where: { organizationId: orgId }
    });
    return state?.lastSuccessfulSync || null;
  } catch {
    return null;
  }
}

/**
 * Update sync state after a sync run.
 */
async function updateSyncState(orgId, status, totalSynced, error = null) {
  try {
    await prisma.syncState.upsert({
      where: { organizationId: orgId },
      update: {
        lastSuccessfulSync: status === 'success' ? new Date() : undefined,
        lastSyncStatus: status,
        lastSyncError: error,
        totalEventsSynced: totalSynced
      },
      create: {
        organizationId: orgId,
        lastSuccessfulSync: status === 'success' ? new Date() : null,
        lastSyncStatus: status,
        lastSyncError: error,
        totalEventsSynced: totalSynced
      }
    });
  } catch (err) {
    console.error('[vTools Sync] Failed to update sync state:', err.message);
  }
}

// ─── Main Sync Function ────────────────────────────────────────────────────

/**
 * Main sync function for IEEE Young Professionals Pune Section.
 *
 * Architecture (spec Section 38):
 *  1. Ensure org records exist
 *  2. Phase 1: Try SPOID-filtered API with custom feed (if UID available)
 *  3. Phase 2 (Fallback): Broad Pune Section retrieval → local SPOID filtering
 *  4. Phase 3: Merge static fallback events
 *  5. Deduplicate, normalize, classify relationships
 *  6. Upsert with source evidence
 *  7. Update sync state
 *
 * @param {string} [targetSpoid] - Specific SPOID to sync (default: IEEE_PRIMARY_SPOID)
 * @returns {{ success: boolean, status: string, total: number, synced: number, error?: string }}
 */
async function syncVtoolsEvents(targetSpoid) {
  const spoid = targetSpoid || IEEE_PRIMARY_SPOID;
  console.log(`[vTools Sync] Starting organization-specific sync for SPOID: ${spoid}...`);

  // Step 1: Ensure organizations exist in DB
  const orgIds = await ensureOrganizations();
  console.log(`[vTools Sync] Organizations ensured: ${Object.keys(orgIds).join(', ')}`);

  let allEvents = [];
  let apiErrors = [];

  // Step 2 — Phase 1: SPOID-filtered API with custom feed UID (spec Section 24)
  if (VTOOLS_FEED_UID) {
    console.log(`[vTools Sync] Phase 1: Using custom feed UID "${VTOOLS_FEED_UID}" with spoid=${spoid}`);
    const feedUrl = `${VTOOLS_API_BASE}/events/list?uid=${VTOOLS_FEED_UID}&spoid=${spoid}&limit=100&sort=-start-time&published=1`;
    const result = await fetchAllPages(feedUrl);
    if (result.error) {
      apiErrors.push(`Custom feed: ${result.error}`);
      console.warn(`[vTools Sync] Phase 1 failed: ${result.error}`);
    } else {
      const includedMap = buildIncludedMap(result.included);
      const parsedEvents = result.items.map(item => parseVtoolsEvent(item, includedMap));
      console.log(`[vTools Sync] Phase 1: ${parsedEvents.length} events from custom feed`);
      allEvents = allEvents.concat(parsedEvents);
    }
  } else {
    console.log('[vTools Sync] Phase 1: No custom feed UID configured, skipping direct SPOID filter');
  }

  // Step 3 — Phase 2 (Fallback): Broad retrieval → local SPOID filtering (spec Section 25-26)
  console.log('[vTools Sync] Phase 2: Broad Pune Section retrieval with local SPOID filtering...');

  // Pass 2a: Tag-based query (primary public API filter)
  const tagUrl = `${VTOOLS_API_BASE}/events/list?tags=pune&limit=100&sort=-start-time&published=1`;
  const tagResult = await fetchAllPages(tagUrl);
  if (tagResult.error) {
    apiErrors.push(`Tag query: ${tagResult.error}`);
  }
  const tagIncludedMap = buildIncludedMap(tagResult.included);
  // Filter to only events with confirmed SPOID relationship
  const tagEvents = tagResult.items
    .filter(item => classifyRelationship(item) !== null)
    .map(item => parseVtoolsEvent(item, tagIncludedMap));
  console.log(`[vTools Sync] Phase 2a (tag query): ${tagResult.items.length} total → ${tagEvents.length} SPOID-matched events`);
  allEvents = allEvents.concat(tagEvents);

  // Pass 2b: Direct SPOID query attempt (may fail without custom feed — spec Section 24)
  const spoidUrl = `${VTOOLS_API_BASE}/events/list?spoid=${spoid}&limit=100&sort=-start-time&published=1`;
  const spoidResult = await fetchAllPages(spoidUrl);
  if (spoidResult.error) {
    apiErrors.push(`SPOID query: ${spoidResult.error}`);
    console.warn(`[vTools Sync] Phase 2b: SPOID direct query failed (expected per spec Section 24): ${spoidResult.error}`);
  } else {
    const spoidIncludedMap = buildIncludedMap(spoidResult.included);
    const spoidEvents = spoidResult.items
      .filter(item => classifyRelationship(item) !== null)
      .map(item => parseVtoolsEvent(item, spoidIncludedMap));
    console.log(`[vTools Sync] Phase 2b (SPOID query): ${spoidResult.items.length} total → ${spoidEvents.length} matched events`);
    allEvents = allEvents.concat(spoidEvents);
  }

  // Step 4 — Phase 3: Merge static fallback events (guaranteed baseline)
  console.log(`[vTools Sync] Phase 3: Merging ${IEEE_YP_PUNE_EVENTS.length} static fallback events`);
  const staticEvents = IEEE_YP_PUNE_EVENTS.map(evt => ({
    ...evt,
    _relationship: {
      spoid: evt._spoid,
      relationshipType: evt._relationship,
      confidence: evt._confidence,
      evidence: `Static seed event for ${evt._spoid}`
    },
    _sourceUrl: evt.registrationLink,
    _source: 'STATIC_SEED'
  }));
  allEvents = allEvents.concat(staticEvents);

  // Step 5 — Deduplicate (spec Sections 17-18)
  const uniqueEvents = deduplicateEvents(allEvents);
  console.log(`[vTools Sync] Deduplication: ${allEvents.length} total → ${uniqueEvents.length} unique events`);

  // Step 6 — Upsert all with source evidence
  let syncedCount = 0;
  for (const evt of uniqueEvents) {
    const saved = await safeUpsert(evt, orgIds);
    if (saved) syncedCount++;
  }

  // Step 7 — Update sync state (spec Section 13)
  const primaryOrgId = orgIds[spoid];
  const syncStatus = apiErrors.length > 0 ? 'partial' : 'success';
  if (primaryOrgId) {
    await updateSyncState(primaryOrgId, syncStatus, syncedCount, apiErrors.join('; ') || null);
  }

  // Per spec Section 33: report partial status when API had errors
  const resultMsg = syncStatus === 'partial'
    ? `Partial sync completed with API errors: ${apiErrors.join('; ')}`
    : 'Full sync completed successfully';
  
  console.log(`[vTools Sync] ✅ ${resultMsg}`);
  console.log(`[vTools Sync] ✅ Saved ${syncedCount}/${uniqueEvents.length} events to database.`);

  return {
    success: true,
    status: syncStatus,
    total: uniqueEvents.length,
    synced: syncedCount,
    errors: apiErrors.length > 0 ? apiErrors : undefined
  };
}

/**
 * Build an includedMap for resolving vTools API relationships (categories, etc.)
 */
function buildIncludedMap(included) {
  const map = new Map();
  if (Array.isArray(included)) {
    included.forEach(inc => map.set(`${inc.type}_${inc.id}`, inc));
  }
  return map;
}

// ─── Organization-Specific Queries ──────────────────────────────────────────

/**
 * Get organization by SPOID.
 */
async function getOrganization(spoid) {
  return prisma.organization.findUnique({
    where: { externalId: spoid }
  });
}

/**
 * Get events for a specific organization, with optional date range filtering.
 * Per spec Section 30: GET /api/organizations/YP00120/events
 */
async function getOrganizationEvents(spoid, { from, to, category, page = 1, limit = 50 } = {}) {
  const org = await prisma.organization.findUnique({
    where: { externalId: spoid }
  });
  if (!org) return { events: [], total: 0, error: `Organization ${spoid} not found` };

  const whereClause = {
    organizationId: org.id,
    event: {
      isDeleted: false,
      ...(category ? { category } : {}),
      ...(from || to ? {
        eventDate: {
          ...(from ? { gte: new Date(`${from}-01-01`) } : {}),
          ...(to ? { lte: new Date(`${to}-12-31T23:59:59Z`) } : {})
        }
      } : {})
    }
  };

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [total, orgEvents] = await Promise.all([
    prisma.organizationEvent.count({ where: whereClause }),
    prisma.organizationEvent.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            eventSources: true
          }
        }
      },
      orderBy: { event: { eventDate: 'desc' } },
      skip,
      take: limitNum
    })
  ]);

  const events = orgEvents.map(oe => ({
    id: oe.event.id,
    vtoolsId: oe.event.vtoolsId,
    title: oe.event.title,
    shortDescription: oe.event.shortDescription,
    fullDescription: oe.event.fullDescription,
    bannerUrl: oe.event.bannerUrl,
    eventDate: oe.event.eventDate,
    venue: oe.event.venue,
    category: oe.event.category,
    status: oe.event.status,
    registrationLink: oe.event.registrationLink,
    relationship: oe.relationshipType,
    confidence: oe.confidence,
    sources: oe.event.eventSources.map(s => ({
      type: s.sourceType,
      url: s.sourceUrl,
      retrievedAt: s.retrievedAt
    }))
  }));

  return {
    organization: {
      id: org.externalId,
      name: org.canonicalName
    },
    dateRange: { from: from || '2016', to: to || new Date().getFullYear().toString() },
    totalEvents: total,
    events,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum
    }
  };
}

/**
 * Get timeline of events for an organization (grouped by year).
 */
async function getOrganizationTimeline(spoid) {
  const org = await prisma.organization.findUnique({
    where: { externalId: spoid }
  });
  if (!org) return null;

  const orgEvents = await prisma.organizationEvent.findMany({
    where: {
      organizationId: org.id,
      event: { isDeleted: false }
    },
    include: { event: true },
    orderBy: { event: { eventDate: 'desc' } }
  });

  // Group by year
  const timeline = {};
  for (const oe of orgEvents) {
    const year = oe.event.eventDate.getFullYear();
    if (!timeline[year]) timeline[year] = [];
    timeline[year].push({
      id: oe.event.id,
      title: oe.event.title,
      date: oe.event.eventDate,
      category: oe.event.category,
      status: oe.event.status,
      relationship: oe.relationshipType,
      confidence: oe.confidence
    });
  }

  return {
    organization: {
      id: org.externalId,
      name: org.canonicalName
    },
    timeline
  };
}

/**
 * Get event sources (provenance) for a specific event.
 */
async function getEventSources(eventId) {
  return prisma.eventSource.findMany({
    where: { eventId },
    orderBy: { retrievedAt: 'desc' }
  });
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  syncVtoolsEvents,
  getOrganization,
  getOrganizationEvents,
  getOrganizationTimeline,
  getEventSources,
  ensureOrganizations,
  IEEE_YP_PUNE_EVENTS,
  // Expose for testing
  classifyRelationship,
  normalizeTitle,
  deduplicateEvents,
  fetchAllPages,
  parseVtoolsEvent,
  safeUpsert
};

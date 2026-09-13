const prisma = require('../config/prisma');
const { v4: uuidv4 } = require('uuid');

// In-memory fallback store when PostgreSQL / Prisma DB table is offline
let memoryGrants = [
  {
    id: "grant-codebhoomi",
    category: "Grants & Funding",
    title: "IEEE CODEBhoomi Rural Literacy Grant",
    organization: "IEEE Humanitarian Activities Committee (HAC)",
    amount: "USD $5,000",
    year: "2024 – 2026",
    status: "Active Grant",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: "Coins",
    description: "Prestigious IEEE global funding allocated to establish computer laboratories and digital literacy programs across 3 rural schools surrounding Pune.",
    impact: "Impacted 1,200+ rural students with hands-on digital education.",
  },
  {
    id: "award-r10-exemplary",
    category: "Awards & Recognition",
    title: "IEEE R10 Outstanding YP Affinity Group Award",
    organization: "IEEE Region 10 (Asia-Pacific)",
    amount: "Regional Trophy & Certificate",
    year: "2024",
    status: "Award Winner",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: "Trophy",
    description: "Recognized as the top Young Professionals Affinity Group across IEEE Region 10 for exceptional volunteer engagement, technical webinars, and membership growth.",
    impact: "Ranked #1 YP Group in Region 10 Asia-Pacific.",
  },
  {
    id: "grant-mm-research",
    category: "Grants & Funding",
    title: "M&M International Research Support Grant",
    organization: "IEEE Young Professionals Committee",
    amount: "USD $2,500",
    year: "2025",
    status: "Active Grant",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: "GraduationCap",
    description: "Travel and publication grant supporting undergraduate research papers authored by Pune Section students under international IEEE YP mentorship.",
    impact: "Funded 8 peer-reviewed IEEE conference publications.",
  },
  {
    id: "award-section-volunteer",
    category: "Awards & Recognition",
    title: "IEEE Pune Section Outstanding Leadership Award",
    organization: "IEEE Pune Section Executive Committee",
    amount: "Honorary Citation & Grant",
    year: "2024",
    status: "Annual Award",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: "Award",
    description: "Annual section accolade honoring young professional officers for leading flagship technical congresses and mentoring student branch chapters.",
    impact: "Recognized 5 student branch executive counselors.",
  },
  {
    id: "grant-eureka-sponsorship",
    category: "Sponsorships",
    title: "IEEE EU-REKA Innovation Sponsorship",
    organization: "IEEE India Council & Industry Partners",
    amount: "INR ₹1,50,000",
    year: "2025",
    status: "Active Sponsorship",
    badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    icon: "Sparkles",
    description: "Innovation funding and jury mentorship sponsorship supporting engineering student projects showcased at the annual EU-REKA National Competition.",
    impact: "Sponsored prototype builds for 15 student teams.",
  },
];

/**
 * GET /api/grants
 * Fetch all grants and awards
 */
const getGrants = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (prisma.grantAndAward) {
      const where = {};
      if (category && category !== 'All') {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { organization: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const grants = await prisma.grantAndAward.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (grants && grants.length > 0) {
        return res.status(200).json({ success: true, count: grants.length, grants });
      }
    }
  } catch (error) {
    console.warn('Prisma DB query failed, serving from memory store:', error.message);
  }

  // Memory fallback filtering
  let filtered = [...memoryGrants];
  const { category, search } = req.query;
  if (category && category !== 'All') {
    filtered = filtered.filter(g => g.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(g => 
      g.title.toLowerCase().includes(q) || 
      g.organization.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    count: filtered.length,
    grants: filtered,
  });
};

/**
 * GET /api/grants/:id
 */
const getGrantById = async (req, res) => {
  const { id } = req.params;
  try {
    if (prisma.grantAndAward) {
      const grant = await prisma.grantAndAward.findUnique({ where: { id } });
      if (grant) return res.status(200).json({ success: true, grant });
    }
  } catch (error) {
    console.warn('Prisma fetch error:', error.message);
  }

  const memItem = memoryGrants.find(g => g.id === id);
  if (!memItem) {
    return res.status(404).json({ success: false, message: 'Grant or award not found' });
  }

  return res.status(200).json({ success: true, grant: memItem });
};

/**
 * POST /api/grants
 * Create a new grant/award (Admin Protected)
 */
const createGrant = async (req, res) => {
  try {
    const {
      title,
      category,
      organization,
      amount,
      year,
      status,
      badgeColor,
      icon,
      description,
      impact,
      linkUrl,
    } = req.body;

    if (!title || !category || !organization || !amount || !year || !status || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: title, category, organization, amount, year, status, description',
      });
    }

    const grantData = {
      id: uuidv4(),
      title,
      category,
      organization,
      amount,
      year,
      status,
      badgeColor: badgeColor || 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      icon: icon || 'Award',
      description,
      impact: impact || '',
      linkUrl: linkUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try saving to DB if Prisma model exists
    try {
      if (prisma.grantAndAward) {
        const dbGrant = await prisma.grantAndAward.create({ data: grantData });
        memoryGrants.unshift(dbGrant);
        return res.status(201).json({
          success: true,
          message: 'Grant or award created successfully',
          grant: dbGrant,
        });
      }
    } catch (dbErr) {
      console.warn('DB creation failed, saving in memory:', dbErr.message);
    }

    // Memory Fallback Save
    memoryGrants.unshift(grantData);
    return res.status(201).json({
      success: true,
      message: 'Grant or award created successfully',
      grant: grantData,
    });
  } catch (error) {
    console.error('Error creating grant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create grant or award',
      error: error.message,
    });
  }
};

/**
 * PUT /api/grants/:id
 */
const updateGrant = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (prisma.grantAndAward) {
      const updated = await prisma.grantAndAward.update({ where: { id }, data });
      if (updated) {
        const idx = memoryGrants.findIndex(g => g.id === id);
        if (idx !== -1) memoryGrants[idx] = { ...memoryGrants[idx], ...updated };
        return res.status(200).json({ success: true, message: 'Updated successfully', grant: updated });
      }
    }
  } catch (dbErr) {
    console.warn('DB update failed, updating memory:', dbErr.message);
  }

  const idx = memoryGrants.findIndex(g => g.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Grant or award not found' });
  }

  memoryGrants[idx] = { ...memoryGrants[idx], ...data, updatedAt: new Date().toISOString() };
  return res.status(200).json({ success: true, message: 'Updated successfully', grant: memoryGrants[idx] });
};

/**
 * DELETE /api/grants/:id
 */
const deleteGrant = async (req, res) => {
  const { id } = req.params;

  try {
    if (prisma.grantAndAward) {
      const exists = await prisma.grantAndAward.findUnique({ where: { id } });
      if (exists) {
        await prisma.grantAndAward.delete({ where: { id } });
      }
    }
  } catch (dbErr) {
    console.warn('DB delete attempt skipped/handled:', dbErr.message);
  }

  memoryGrants = memoryGrants.filter(g => g.id !== id);
  return res.status(200).json({ success: true, message: 'Deleted successfully' });
};

module.exports = {
  getGrants,
  getGrantById,
  createGrant,
  updateGrant,
  deleteGrant,
};

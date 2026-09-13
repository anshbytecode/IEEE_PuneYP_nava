const prisma = require('../config/prisma');

const getStats = async (req, res) => {
  try {
    // Run all count queries concurrently using Prisma promise aggregation
    const [
      eventsCount,
      blogsCount,
      teamCount,
      mediaCount,
      registrationsCount,
      contactsCount
    ] = await Promise.all([
      prisma.event.count({ where: { isDeleted: false } }),
      prisma.blog.count(),
      prisma.teamMember.count(),
      prisma.media.count(),
      prisma.eventRegistration.count(),
      prisma.contact.count({ where: { isResolved: false } })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalEvents: eventsCount,
        totalBlogs: blogsCount,
        totalTeamMembers: teamCount,
        totalMediaFiles: mediaCount,
        totalRegistrations: registrationsCount,
        pendingContacts: contactsCount
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};

const getChartsData = async (req, res) => {
  try {
    // 1. Registrations trend in last 6 months (fetched and grouped in-memory for DB engine scaling)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrations = await prisma.eventRegistration.findMany({
      where: {
        registeredAt: { gte: sixMonthsAgo }
      },
      select: { registeredAt: true },
      orderBy: { registeredAt: 'asc' }
    });

    const monthsMap = new Map();
    registrations.forEach(r => {
      const date = new Date(r.registeredAt);
      const key = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthsMap.set(key, (monthsMap.get(key) || 0) + 1);
    });

    const registrationsTrend = Array.from(monthsMap.entries()).map(([month, count]) => ({
      month,
      count
    }));

    // 2. Events breakdown by category
    const categories = await prisma.event.groupBy({
      by: ['category'],
      where: { isDeleted: false },
      _count: { id: true }
    });

    const eventsByCategory = categories.map(c => ({
      category: c.category,
      count: c._count.id
    }));

    // 3. Blogs publish status
    const blogsStatus = await prisma.blog.groupBy({
      by: ['publishStatus'],
      _count: { id: true }
    });

    const blogsByStatus = blogsStatus.map(b => ({
      publish_status: b.publishStatus,
      count: b._count.id
    }));

    return res.status(200).json({
      success: true,
      charts: {
        registrationsTrend,
        eventsByCategory,
        blogsByStatus
      }
    });
  } catch (error) {
    console.error('Get charts data error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve chart analytics.' });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    // Fetch recent events, blogs, and contacts
    const [recentEvents, recentBlogs, recentContacts] = await Promise.all([
      prisma.event.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, createdAt: true, category: true }
      }),
      prisma.blog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, createdAt: true, publishStatus: true }
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, subject: true, createdAt: true, isResolved: true }
      })
    ]);

    // Format activities into a single timeline
    const activities = [];

    recentEvents.forEach(event => {
      activities.push({
        id: `event-${event.id}`,
        type: 'event',
        title: `New Event Added: ${event.title}`,
        description: `Categorized under "${event.category}"`,
        date: event.createdAt
      });
    });

    recentBlogs.forEach(blog => {
      activities.push({
        id: `blog-${blog.id}`,
        type: 'blog',
        title: `Blog Post Created: ${blog.title}`,
        description: `Status: ${blog.publishStatus}`,
        date: blog.createdAt
      });
    });

    recentContacts.forEach(contact => {
      activities.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        title: `Contact Request from ${contact.name}`,
        description: `Subject: "${contact.subject || 'No Subject'}" - Resolved: ${contact.isResolved}`,
        date: contact.createdAt
      });
    });

    // Sort by date descending — newest activity first
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.status(200).json({
      success: true,
      activities: activities.slice(0, 8) // return top 8
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recent activities.' });
  }
};

module.exports = {
  getStats,
  getChartsData,
  getRecentActivities
};

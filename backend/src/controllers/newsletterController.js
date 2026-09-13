const prisma = require('../config/prisma');

const getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [totalItems, subscribers] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limitNum
      })
    ]);

    return res.status(200).json({
      success: true,
      subscribers,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve newsletter subscribers.' });
  }
};

const exportCSV = async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        email: true,
        subscribedAt: true
      }
    });
    
    // Create CSV content in memory
    let csvContent = 'Email,Subscription Date\n';
    
    subscribers.forEach(sub => {
      const date = new Date(sub.subscribedAt).toISOString().split('T')[0];
      csvContent += `"${sub.email}","${date}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter_subscribers.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export newsletter subscribers CSV error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export subscriber list.' });
  }
};

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed.' });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully to our newsletter!',
      subscriber
    });
  } catch (error) {
    console.error('Subscribe newsletter error:', error);
    return res.status(500).json({ success: false, message: 'Failed to subscribe to newsletter.' });
  }
};

module.exports = {
  getSubscribers,
  exportCSV,
  subscribe
};


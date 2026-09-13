const prisma = require('../config/prisma');

const getContacts = async (req, res) => {
  try {
    const { is_resolved, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query clauses
    const whereClause = {};

    if (is_resolved !== undefined && is_resolved !== '') {
      whereClause.isResolved = is_resolved === 'true';
    }

    // Run count and query concurrently
    const [totalItems, contacts] = await Promise.all([
      prisma.contact.count({ where: whereClause }),
      prisma.contact.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      })
    ]);

    return res.status(200).json({
      success: true,
      contacts,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get contact requests error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve contact inquiries.' });
  }
};

const resolveContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact request exists
    const contact = await prisma.contact.findUnique({
      where: { id }
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact request not found.' });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { isResolved: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Contact request marked as resolved.',
      contact: updatedContact
    });
  } catch (error) {
    console.error('Resolve contact error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resolve contact request.' });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        isResolved: false
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit contact request.' });
  }
};

module.exports = {
  getContacts,
  resolveContact,
  createContact
};


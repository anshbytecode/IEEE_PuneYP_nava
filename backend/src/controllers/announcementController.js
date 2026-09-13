const prisma = require('../config/prisma');

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      success: true,
      announcements
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve announcements.' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, link, is_active } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        link: link || null,
        isActive: is_active !== undefined ? is_active : true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully.',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create announcement.' });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if announcement exists
    const existing = await prisma.announcement.findUnique({
      where: { id }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const { title, content, link, is_active } = req.body;

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title: title || existing.title,
        content: content || existing.content,
        link: link !== undefined ? link : existing.link,
        isActive: is_active !== undefined ? is_active : existing.isActive
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully.',
      announcement: updated
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if announcement exists
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await prisma.announcement.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};

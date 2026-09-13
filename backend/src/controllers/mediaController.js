const prisma = require('../config/prisma');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

const getMedia = async (req, res) => {
  try {
    const { event_id, file_type, search, page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query clauses
    const whereClause = {};

    if (event_id) {
      if (event_id === 'general') {
        whereClause.eventId = null;
      } else {
        whereClause.eventId = event_id;
      }
    }

    if (file_type) {
      whereClause.fileType = file_type;
    }

    if (search) {
      whereClause.fileName = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Run count and query concurrently
    const [totalItems, media] = await Promise.all([
      prisma.media.count({ where: whereClause }),
      prisma.media.findMany({
        where: whereClause,
        include: {
          event: {
            select: {
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      })
    ]);

    // Format for frontend compatibility (mapping relation object to event_title string)
    const formattedMedia = media.map(item => {
      const m = { ...item };
      m.event_title = item.event ? item.event.title : null;
      delete m.event;
      return m;
    });

    return res.status(200).json({
      success: true,
      media: formattedMedia,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve media library.' });
  }
};

const uploadMedia = async (req, res) => {
  try {
    const { event_id } = req.body;
    const files = req.files || {};
    
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ success: false, message: 'No file provided for upload.' });
    }

    const uploadedFile = files.file[0];
    const originalName = uploadedFile.originalname;
    const mime = uploadedFile.mimetype;
    const size = uploadedFile.size;

    // Detect file type and map Cloudinary resource type
    let fileType = 'image';
    let resourceType = 'image';
    let cloudinaryFolder = 'gallery/images';

    if (mime.startsWith('video/')) {
      fileType = 'video';
      resourceType = 'video';
      cloudinaryFolder = 'gallery/videos';
    } else if (mime === 'application/pdf') {
      fileType = 'pdf';
      resourceType = 'raw';
      cloudinaryFolder = 'gallery/pdfs';
    } else if (!mime.startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'Unsupported file mime type.' });
    }

    // Connect to Cloudinary
    const uploadResult = await uploadBufferToCloudinary(
      uploadedFile.buffer,
      cloudinaryFolder,
      resourceType
    );

    // Save to Database
    const mediaItem = await prisma.media.create({
      data: {
        fileName: originalName,
        fileUrl: uploadResult.secure_url,
        fileType,
        fileSize: size,
        cloudinaryPublicId: uploadResult.public_id,
        eventId: event_id && event_id !== 'general' ? event_id : null
      }
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      mediaItem
    });
  } catch (error) {
    console.error('Upload media error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload media. ' + error.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve file info from database
    const mediaItem = await prisma.media.findUnique({
      where: { id }
    });
    if (!mediaItem) {
      return res.status(404).json({ success: false, message: 'Media file not found.' });
    }

    // Determine Cloudinary resource type
    let resourceType = 'image';
    if (mediaItem.fileType === 'video') {
      resourceType = 'video';
    } else if (mediaItem.fileType === 'pdf') {
      resourceType = 'raw';
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(mediaItem.cloudinaryPublicId, resourceType);

    // Delete from database
    await prisma.media.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Media file deleted successfully.'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete media.' });
  }
};

module.exports = {
  getMedia,
  uploadMedia,
  deleteMedia
};

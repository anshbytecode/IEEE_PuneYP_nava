const prisma = require('../config/prisma');
const { uploadBufferToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../services/cloudinaryService');

// Helper to deserialize SQLite JSON string tags back to JS arrays
const formatBlog = (blog) => {
  if (!blog) return null;
  const b = { ...blog };
  if (typeof b.tags === 'string') {
    try {
      b.tags = JSON.parse(b.tags);
    } catch {
      b.tags = [];
    }
  }
  return b;
};

const getBlogs = async (req, res) => {
  try {
    const { status, search, tag, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query clauses
    const whereClause = {};

    if (status) {
      whereClause.publishStatus = status;
    }

    if (tag) {
      // For SQLite, tags is a JSON String, we use contains to query it
      whereClause.tags = {
        contains: tag
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ];
    }

    // Run count and query concurrently
    const [totalItems, blogs] = await Promise.all([
      prisma.blog.count({ where: whereClause }),
      prisma.blog.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      })
    ]);

    // Format author and tags data for API compatibility
    const formattedBlogs = blogs.map(blog => {
      const b = formatBlog(blog);
      b.author_name = blog.author ? blog.author.name : null;
      b.author_email = blog.author ? blog.author.email : null;
      delete b.author;
      return b;
    });

    return res.status(200).json({
      success: true,
      blogs: formattedBlogs,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve blogs.' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    // Flatten author and parse tags
    const formattedBlog = formatBlog(blog);
    formattedBlog.author_name = blog.author ? blog.author.name : null;
    formattedBlog.author_email = blog.author ? blog.author.email : null;
    delete formattedBlog.author;

    return res.status(200).json({
      success: true,
      blog: formattedBlog
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve blog post details.' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, publish_status } = req.body;
    const author_id = req.user.id; // From authMiddleware

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    let thumbnailUrl = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=500&q=80';
    const files = req.files || {};

    if (files.thumbnail && files.thumbnail[0]) {
      const uploadResult = await uploadBufferToCloudinary(files.thumbnail[0].buffer, 'blogs', 'image');
      thumbnailUrl = uploadResult.secure_url;
    }

    // Parse tags array
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = Array.isArray(tags) ? tags : [tags];
      }
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        thumbnailUrl,
        tags: JSON.stringify(parsedTags),
        publishStatus: publish_status || 'Published',
        authorId: author_id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully.',
      blog: formatBlog(blog)
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create blog post.' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    });
    if (!existingBlog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    const formattedExistingBlog = formatBlog(existingBlog);

    const { title, content, tags, publish_status } = req.body;
    const files = req.files || {};

    let thumbnailUrl = formattedExistingBlog.thumbnailUrl;
    if (files.thumbnail && files.thumbnail[0]) {
      const oldThumbPublicId = getPublicIdFromUrl(formattedExistingBlog.thumbnailUrl);
      if (oldThumbPublicId) {
        await deleteFromCloudinary(oldThumbPublicId, 'image');
      }
      const uploadResult = await uploadBufferToCloudinary(files.thumbnail[0].buffer, 'blogs', 'image');
      thumbnailUrl = uploadResult.secure_url;
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = Array.isArray(tags) ? tags : [tags];
      }
    } else {
      parsedTags = formattedExistingBlog.tags;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title || formattedExistingBlog.title,
        content: content || formattedExistingBlog.content,
        thumbnailUrl,
        tags: JSON.stringify(parsedTags),
        publishStatus: publish_status || formattedExistingBlog.publishStatus
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully.',
      blog: formatBlog(updatedBlog)
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update blog post.' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    // Remove thumbnail from Cloudinary
    const thumbPublicId = getPublicIdFromUrl(blog.thumbnailUrl);
    if (thumbPublicId) {
      await deleteFromCloudinary(thumbPublicId, 'image');
    }

    // Delete from Database
    await prisma.blog.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete blog post.' });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};

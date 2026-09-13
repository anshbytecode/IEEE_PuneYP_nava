const prisma = require('../config/prisma');
const { uploadBufferToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../services/cloudinaryService');

// Helper to deserialize SQLite JSON strings back to JS Arrays and format organization details
const formatEvent = (event) => {
  if (!event) return null;
  const e = { ...event };
  
  if (typeof e.galleryUrls === 'string') {
    try {
      e.galleryUrls = JSON.parse(e.galleryUrls);
    } catch {
      e.galleryUrls = [];
    }
  }
  
  if (typeof e.sdgAlignment === 'string') {
    try {
      e.sdgAlignment = JSON.parse(e.sdgAlignment);
    } catch {
      e.sdgAlignment = [];
    }
  }

  // Format organization affiliations
  const orgEvents = e.organizationEvents || [];
  const spoids = orgEvents.map(oe => oe.organization?.externalId).filter(Boolean);
  
  const textToCheck = `${e.title || ''} ${e.venue || ''} ${e.shortDescription || ''} ${e.fullDescription || ''} ${e.vtoolsId || ''}`.toLowerCase();
  const isYpPune = spoids.includes('YP00120') ||
                   (e.vtoolsId && String(e.vtoolsId).startsWith('YP00120')) ||
                   textToCheck.includes('yp00120') ||
                   textToCheck.includes('young professionals') ||
                   textToCheck.includes('ieee yp');

  e.isYpPune = isYpPune;
  e.spoids = spoids;
  e.organizations = orgEvents.map(oe => ({
    spoid: oe.organization?.externalId,
    name: oe.organization?.canonicalName,
    relationship: oe.relationshipType,
    confidence: oe.confidence
  }));
  
  return e;
};

const getEvents = async (req, res) => {
  try {
    const { category, status, search, spoid, page = 1, limit = 500 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query filters
    const whereClause = {
      isDeleted: false
    };

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (spoid) {
      whereClause.organizationEvents = {
        some: {
          organization: {
            externalId: spoid
          }
        }
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { venue: { contains: search } },
        { shortDescription: { contains: search } }
      ];
    }

    // Run count and fetch concurrently
    const [totalItems, events] = await Promise.all([
      prisma.event.count({ where: whereClause }),
      prisma.event.findMany({
        where: whereClause,
        include: {
          organizationEvents: {
            include: {
              organization: true
            }
          }
        },
        orderBy: { eventDate: 'desc' },
        skip,
        take: limitNum
      })
    ]);

    const formattedEvents = events.map(formatEvent);
    
    return res.status(200).json({
      success: true,
      events: formattedEvents,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve events.' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findFirst({
      where: { id, isDeleted: false },
      include: {
        _count: {
          select: { registrations: true }
        },
        organizationEvents: {
          include: {
            organization: true
          }
        }
      }
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Map registration count to the event object
    const eventData = formatEvent({
      ...event,
      registration_count: event._count.registrations
    });
    delete eventData._count;

    return res.status(200).json({
      success: true,
      event: eventData
    });
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve event details.' });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      short_description,
      full_description,
      event_date,
      venue,
      registration_link,
      sdg_alignment,
      category,
      status
    } = req.body;

    if (!title || !short_description || !full_description || !category) {
      return res.status(400).json({ success: false, message: 'Missing required event fields.' });
    }

    const finalEventDate = event_date ? new Date(event_date) : new Date();
    const finalVenue = venue || 'Online';

    let bannerUrl = '';
    let galleryUrls = [];
    let videoUrl = '';

    const files = req.files || {};

    // 1. Upload banner (Required)
    if (files.banner && files.banner[0]) {
      const bannerResult = await uploadBufferToCloudinary(files.banner[0].buffer, 'events/banners', 'image');
      bannerUrl = bannerResult.secure_url;
    } else {
      return res.status(400).json({ success: false, message: 'Event banner image is required.' });
    }

    // 2. Upload gallery images (Optional)
    if (files.gallery) {
      const uploadPromises = files.gallery.map(file => 
        uploadBufferToCloudinary(file.buffer, 'events/gallery', 'image')
      );
      const galleryResults = await Promise.all(uploadPromises);
      galleryUrls = galleryResults.map(r => r.secure_url);
    }

    // 3. Upload video (Optional)
    if (files.video && files.video[0]) {
      const videoResult = await uploadBufferToCloudinary(files.video[0].buffer, 'events/videos', 'video');
      videoUrl = videoResult.secure_url;
    }

    // Parse SDG Alignment from body
    let parsedSdg = [];
    if (sdg_alignment) {
      try {
        parsedSdg = typeof sdg_alignment === 'string' ? JSON.parse(sdg_alignment) : sdg_alignment;
      } catch (e) {
        parsedSdg = Array.isArray(sdg_alignment) ? sdg_alignment : [sdg_alignment];
      }
    }

    const event = await prisma.event.create({
      data: {
        title,
        shortDescription: short_description,
        fullDescription: full_description,
        bannerUrl,
        galleryUrls: JSON.stringify(galleryUrls),
        videoUrl: videoUrl || null,
        eventDate: finalEventDate,
        venue: finalVenue,
        registrationLink: registration_link || null,
        sdgAlignment: JSON.stringify(parsedSdg),
        category,
        status: status || 'Upcoming'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: formatEvent(event)
    });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event. ' + error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const existingEvent = await prisma.event.findFirst({
      where: { id, isDeleted: false }
    });
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const formattedExistingEvent = formatEvent(existingEvent);

    const {
      title,
      short_description,
      full_description,
      event_date,
      venue,
      registration_link,
      sdg_alignment,
      category,
      status,
      existing_gallery_urls
    } = req.body;

    const files = req.files || {};

    // 1. Handle Banner Update
    let bannerUrl = formattedExistingEvent.bannerUrl;
    if (files.banner && files.banner[0]) {
      const oldBannerPublicId = getPublicIdFromUrl(formattedExistingEvent.bannerUrl);
      if (oldBannerPublicId) {
        await deleteFromCloudinary(oldBannerPublicId, 'image');
      }
      const bannerResult = await uploadBufferToCloudinary(files.banner[0].buffer, 'events/banners', 'image');
      bannerUrl = bannerResult.secure_url;
    }

    // 2. Handle Gallery Update
    let finalGalleryUrls = [];
    if (existing_gallery_urls) {
      try {
        finalGalleryUrls = typeof existing_gallery_urls === 'string' ? JSON.parse(existing_gallery_urls) : existing_gallery_urls;
      } catch (e) {
        finalGalleryUrls = Array.isArray(existing_gallery_urls) ? existing_gallery_urls : [existing_gallery_urls];
      }
    } else {
      finalGalleryUrls = formattedExistingEvent.galleryUrls || [];
    }

    // Identify removed images to delete from Cloudinary
    const removedGallery = (formattedExistingEvent.galleryUrls || []).filter(url => !finalGalleryUrls.includes(url));
    for (const url of removedGallery) {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        await deleteFromCloudinary(publicId, 'image');
      }
    }

    // Upload new gallery images and append
    if (files.gallery) {
      const uploadPromises = files.gallery.map(file => 
        uploadBufferToCloudinary(file.buffer, 'events/gallery', 'image')
      );
      const newResults = await Promise.all(uploadPromises);
      const newUrls = newResults.map(r => r.secure_url);
      finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
    }

    // 3. Handle Video Update
    let videoUrl = formattedExistingEvent.videoUrl;
    if (files.video && files.video[0]) {
      if (formattedExistingEvent.videoUrl) {
        const oldVideoPublicId = getPublicIdFromUrl(formattedExistingEvent.videoUrl);
        if (oldVideoPublicId) {
          await deleteFromCloudinary(oldVideoPublicId, 'video');
        }
      }
      const videoResult = await uploadBufferToCloudinary(files.video[0].buffer, 'events/videos', 'video');
      videoUrl = videoResult.secure_url;
    } else if (req.body.delete_video === 'true') {
      if (formattedExistingEvent.videoUrl) {
        const oldVideoPublicId = getPublicIdFromUrl(formattedExistingEvent.videoUrl);
        if (oldVideoPublicId) {
          await deleteFromCloudinary(oldVideoPublicId, 'video');
        }
      }
      videoUrl = null;
    }

    // Parse SDG Alignment
    let parsedSdg = [];
    if (sdg_alignment) {
      try {
        parsedSdg = typeof sdg_alignment === 'string' ? JSON.parse(sdg_alignment) : sdg_alignment;
      } catch (e) {
        parsedSdg = Array.isArray(sdg_alignment) ? sdg_alignment : [sdg_alignment];
      }
    } else {
      parsedSdg = formattedExistingEvent.sdgAlignment;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title || formattedExistingEvent.title,
        shortDescription: short_description || formattedExistingEvent.shortDescription,
        fullDescription: full_description || formattedExistingEvent.fullDescription,
        bannerUrl,
        galleryUrls: JSON.stringify(finalGalleryUrls),
        videoUrl,
        eventDate: event_date ? new Date(event_date) : formattedExistingEvent.eventDate,
        venue: venue || formattedExistingEvent.venue,
        registrationLink: registration_link !== undefined ? registration_link : formattedExistingEvent.registrationLink,
        sdgAlignment: JSON.stringify(parsedSdg),
        category: category || formattedExistingEvent.category,
        status: status || formattedExistingEvent.status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event: formatEvent(updatedEvent)
    });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event. ' + error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const existingEvent = await prisma.event.findFirst({
      where: { id, isDeleted: false }
    });
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Soft delete: set isDeleted = true
    await prisma.event.update({
      where: { id },
      data: { isDeleted: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Event soft-deleted successfully.'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify event exists
    const event = await prisma.event.findFirst({
      where: { id, isDeleted: false },
      select: { title: true }
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { registeredAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      eventTitle: event.title,
      registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve registrations.' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, registrationDetails } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if event exists and is not deleted
    const event = await prisma.event.findFirst({
      where: { id, isDeleted: false }
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check if user is already registered for this event
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId: id,
        email: normalizedEmail
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        name,
        email: normalizedEmail,
        contact: contact || null,
        registrationDetails: registrationDetails ? JSON.stringify(registrationDetails) : null
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Registered successfully!',
      registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit registration.' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  registerForEvent
};


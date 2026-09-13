const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter based on mime type
const fileFilter = (req, file, cb) => {
  const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedVideoMimeTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  const allowedPDFMimeTypes = ['application/pdf'];

  const allAllowedTypes = [...allowedImageMimeTypes, ...allowedVideoMimeTypes, ...allowedPDFMimeTypes];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only JPEG, PNG, GIF, WEBP, SVG, MP4, AVI, MOV, and PDF are supported.`), false);
  }
};

// Multer upload configurations
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // We handle size checks dynamically inside controllers for better error messaging,
    // but we set a high boundary of 100MB here for the stream.
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Helper limits for validation
const limits = {
  image: 10 * 1024 * 1024,  // 10MB
  video: 50 * 1024 * 1024,  // 50MB
  pdf: 20 * 1024 * 1024     // 20MB
};

const validateFileSizes = (req, res, next) => {
  const checkFile = (file) => {
    if (!file) return null;
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    const isPdf = file.mimetype === 'application/pdf';

    if (isImage && file.size > limits.image) {
      return `Image "${file.originalname}" exceeds 10MB limit.`;
    }
    if (isVideo && file.size > limits.video) {
      return `Video "${file.originalname}" exceeds 50MB limit.`;
    }
    if (isPdf && file.size > limits.pdf) {
      return `PDF "${file.originalname}" exceeds 20MB limit.`;
    }
    return null;
  };

  try {
    let errorMsg = null;
    
    // Check single file
    if (req.file) {
      errorMsg = checkFile(req.file);
    }
    
    // Check array files
    if (req.files) {
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          errorMsg = errorMsg || checkFile(file);
        }
      } else {
        // Mixed fields
        for (const fieldname in req.files) {
          for (const file of req.files[fieldname]) {
            errorMsg = errorMsg || checkFile(file);
          }
        }
      }
    }

    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  validateFileSizes,
  uploadEventFiles: upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'video', maxCount: 1 }
  ]),
  uploadBlogFiles: upload.fields([
    { name: 'thumbnail', maxCount: 1 }
  ]),
  uploadTeamFiles: upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
  uploadMediaLibraryFiles: upload.fields([
    { name: 'file', maxCount: 1 }
  ]),
  uploadBranchFiles: upload.fields([
    { name: 'logo', maxCount: 1 }
  ])
};

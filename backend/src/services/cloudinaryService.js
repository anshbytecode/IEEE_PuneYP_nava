const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer directly to Cloudinary using streaming.
 * @param {Buffer} fileBuffer - File contents in memory buffer format.
 * @param {string} folder - Destination folder in Cloudinary (e.g. 'events', 'blogs').
 * @param {string} resourceType - Mime category ('image', 'video', 'raw' for PDFs).
 * @returns {Promise<object>} - Cloudinary upload response containing secure_url and public_id.
 */
const uploadBufferToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `ieee_pune_yp/${folder}`,
      resource_type: resourceType
    };

    // Auto-optimize image size and formats
    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' }
      ];
    }

    // Set streaming pipe
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary buffer stream upload failed:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Push buffer to the stream
    const { Readable } = require('stream');
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(stream);
  });
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - The Cloudinary public identifier.
 * @param {string} resourceType - The resource type ('image', 'video', 'raw').
 * @returns {Promise<object>} - Cloudinary destruction response status.
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary asset removal failed:', error);
    throw error;
  }
};

/**
 * Extracts the public ID from a Cloudinary secure URL.
 * @param {string} url - Cloudinary secure URL.
 * @returns {string|null} - Public ID string or null.
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const subParts = parts[1].split('/');
    // Remove version tag (e.g. v16875293)
    if (subParts[0].startsWith('v')) {
      subParts.shift();
    }
    const pathWithExtension = subParts.join('/');
    const lastDot = pathWithExtension.lastIndexOf('.');
    if (lastDot !== -1) {
      return pathWithExtension.substring(0, lastDot);
    }
    return pathWithExtension;
  } catch (err) {
    console.error('Error parsing public ID from Cloudinary URL:', err);
    return null;
  }
};

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl
};

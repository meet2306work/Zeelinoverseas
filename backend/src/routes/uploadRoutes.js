const express = require('express');
const router = express.Router();
const { upload, isCloudinaryConfigured } = require('../middlewares/uploadMiddleware');
const sendResponse = require('../utils/responseFormatter');
const { protect } = require('../middlewares/auth');

router.post('/', protect, upload.array('images', 5), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadedImages = req.files.map((file) => {
      let url = file.path;
      // If disk storage is used, file.path is the absolute path. Convert it to a public URL.
      if (!isCloudinaryConfigured) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        url = `${baseUrl}/uploads/${file.filename}`;
      }
      return {
        url: url,
        public_id: file.filename,
      };
    });

    sendResponse(res, 201, 'Images uploaded successfully', uploadedImages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

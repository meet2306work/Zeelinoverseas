const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
                              process.env.CLOUDINARY_API_KEY &&
                              process.env.CLOUDINARY_API_KEY !== 'your_api_key';

// Allowed MIME types — never use upload.any() without a fileFilter (bug #7)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'model/gltf-binary',   // .glb
  'model/gltf+json',     // .gltf
];

// Allowed extensions (belt-and-suspenders with MIME check)
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.glb', '.gltf'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.originalname}. Accepted types: JPG, PNG, WEBP, GIF, PDF, GLB, GLTF`), false);
  }
};

let storage;

if (isCloudinaryConfigured) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.glb' || ext === '.gltf') {
        return {
          folder: 'zeelinoverseas_3d',
          resource_type: 'raw',
        };
      }
      return {
        folder: 'zeelinoverseas_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'pdf'],
      };
    },
  });
} else {
  // Local Disk Storage Fallback
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,            // Reject disallowed file types (bug #7)
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit per file
});

module.exports = { upload, cloudinary, isCloudinaryConfigured };

const express = require('express');
const router = express.Router();
const multer = require('multer');
const locationController = require('../controllers/locationController');

// Increase limits and add more robust error handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
    fieldSize: 10 * 1024 * 1024, // 10MB for text fields
    fields: 20, // Increase max number of fields
    parts: 30 // Increase max parts
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Add error handling middleware
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({ 
            error: 'File is too large. Maximum file size is 10MB.' 
          });
        case 'LIMIT_FIELD_SIZE':
          return res.status(400).json({ 
            error: 'Form data is too large. Maximum field size is 10MB.' 
          });
        case 'LIMIT_PART_COUNT':
          return res.status(400).json({ 
            error: 'Too many parts in the form.' 
          });
        default:
          return res.status(500).json({ error: 'Upload error occurred' });
      }
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

// Use the middleware with error handling
router.post('/', uploadMiddleware, locationController.createLocation);
router.put('/:id', uploadMiddleware, locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.get('/search', locationController.searchLocations);

module.exports = router;
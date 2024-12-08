const express = require('express');
const router = express.Router();
const multer = require('multer');
const menuController = require('../controllers/menuController');

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Menu Item Routes
//router.post('/', menuController.createMenuItem);
router.post('/', upload.single('image'), menuController.createMenuItem);
router.put('/:id', upload.single('image'), menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
router.get('/menuitems', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);

module.exports = router;
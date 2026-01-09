const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controller/serviceController');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

// Public routes (for landing pages)
router.get('/', optionalAuth, getAllServices);
router.get('/:id', optionalAuth, getServiceById);

// Protected routes (for admin/business management)
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessStats
} = require('../controller/business.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.get('/', getBusinesses);
router.get('/:id', getBusiness);
router.get('/:id/stats', getBusinessStats);
router.post('/', createBusiness);
router.put('/:id', updateBusiness);
router.delete('/:id', deleteBusiness);

module.exports = router;


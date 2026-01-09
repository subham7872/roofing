const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  createDiscountLead,
  updateLeadStatus,
  updateLead,
  deleteLead
} = require('../controller/lead.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

// Public endpoint for lead submissions
// Routes to createDiscountLead if source is 'discount_modal', otherwise createLead
router.post('/', (req, res, next) => {
  // If source is discount_modal, use simplified endpoint
  if (req.body && req.body.source === 'discount_modal') {
    return createDiscountLead(req, res, next);
  }
  // Otherwise use regular createLead with optional auth
  return optionalAuth(req, res, () => createLead(req, res, next));
});

// Public endpoints for demo dashboard (no auth required)
// IMPORTANT: These must be BEFORE router.use(protect)
router.get('/', (req, res, next) => {
  // Explicitly public route - no auth required
  return getLeads(req, res, next);
});
router.patch('/:id/status', (req, res, next) => {
  // Explicitly public route - no auth required
  return updateLeadStatus(req, res, next);
});

// Protected routes for dashboard
router.use(protect);
router.get('/:id', getLead);
router.put('/:id/status', updateLeadStatus); // Keep PUT for backward compatibility
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;


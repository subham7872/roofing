const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const businessRoutes = require('./business.routes');
const leadRoutes = require('./lead.routes');
const serviceRoutes = require('./services.routes');
const contactRoutes = require('./contact.routes');
const chatbotRoutes = require('./chatbot.routes');

// Legacy emergency routes (for backward compatibility)
const {
  getAllEmergencyRequests,
  getEmergencyRequestById,
  createEmergencyRequest,
  updateEmergencyRequestStatus,
  deleteEmergencyRequest
} = require('../controller/emergencyController');
const { protect } = require('../middleware/auth.middleware');

// New SaaS routes
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/leads', leadRoutes);
router.use('/services', serviceRoutes);
router.use('/contact', contactRoutes);
router.use('/chatbot', chatbotRoutes);

// Legacy emergency routes (kept for backward compatibility)
// These will be deprecated but kept working
router.get('/emergency-requests', protect, getAllEmergencyRequests);
router.get('/emergency-requests/:id', protect, getEmergencyRequestById);
router.post('/emergency-requests', createEmergencyRequest); // Public for forms
router.put('/emergency-requests/:id/status', protect, updateEmergencyRequestStatus);
router.delete('/emergency-requests/:id', protect, deleteEmergencyRequest);

module.exports = router;


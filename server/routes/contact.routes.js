const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContact,
  updateContactStatus
} = require('../controller/contact.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route for submitting contact form
router.post('/', createContact);

// Protected routes for admin
router.use(protect);
router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);

module.exports = router;

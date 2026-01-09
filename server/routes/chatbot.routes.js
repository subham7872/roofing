const express = require('express');
const router = express.Router();
const {
  handleChatbotMessage,
  submitChatbotLead,
  getSessionData,
  handleStructuredMessage,
  submitStructuredLead,
  createChatbotLead
} = require('../controller/chatbot.controller');

// Public routes for chatbot
router.post('/message', handleChatbotMessage);
router.post('/submit', submitChatbotLead);
router.get('/session/:sessionId', getSessionData);

// Structured chatbot routes (hardcoded flow)
router.post('/structured', handleStructuredMessage);
router.post('/structured/submit', submitStructuredLead);

// Simple chatbot lead endpoint
router.post('/lead', createChatbotLead);

module.exports = router;

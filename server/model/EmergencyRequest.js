const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'in_progress', 'completed'],
    default: 'pending'
  },
  safetyAdvice: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);


const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: function() {
      return this.source !== 'discount_modal';
    },
    index: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: function() {
      return this.source !== 'discount_modal';
    }
  },
  serviceName: {
    type: String,
    required: function() {
      return this.source !== 'discount_modal';
    },
    trim: true
  },
  // Contact Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: function() {
      return this.source !== 'discount_modal';
    },
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  pincode: {
    type: String,
    required: function() {
      return this.source !== 'discount_modal';
    },
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true
  },
  // AI Analysis
  intent: {
    type: String,
    enum: ['inquiry', 'emergency', 'quote', 'complaint', 'other'],
    default: 'inquiry'
  },
  urgency: {
    type: String,
    enum: ['emergency', 'high', 'normal', 'low'],
    default: 'normal'
  },
  aiAnalysis: {
    type: String,
    trim: true
  },
  // Lead Management
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'closed', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['form', 'chatbot', 'api', 'manual', 'discount_modal'],
    default: 'form'
  },
  // Metadata
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Webhook tracking
  webhookTriggered: {
    type: Boolean,
    default: false
  },
  webhookResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  // After-hours flag
  afterHours: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
leadSchema.index({ businessId: 1, status: 1, createdAt: -1 });
leadSchema.index({ businessId: 1, urgency: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });

module.exports = mongoose.model('Lead', leadSchema);


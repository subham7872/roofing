const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Business email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    ownerEmail: {
      type: String,
      default: ''
    },
    autoAssignLeads: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
businessSchema.index({ userId: 1, isActive: 1 });

// Validate max 3 businesses per user (enforced in controller)
businessSchema.statics.countByUser = async function(userId) {
  return await this.countDocuments({ userId, isActive: true });
};

module.exports = mongoose.model('Business', businessSchema);


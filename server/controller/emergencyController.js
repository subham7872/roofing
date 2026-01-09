const EmergencyRequest = require('../model/EmergencyRequest');
const Service = require('../model/Service');
const { sendUserConfirmationEmail, sendOwnerNotificationEmail } = require('../config/email');
const { getSafeSteps } = require('../services/geminiService');

// Get all emergency requests (admin)
const getAllEmergencyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find()
      .populate('serviceId', 'title image')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency requests',
      error: error.message
    });
  }
};

// Get single emergency request
const getEmergencyRequestById = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate('serviceId', 'title image description');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency request',
      error: error.message
    });
  }
};

// Create new emergency request
const createEmergencyRequest = async (req, res) => {
  try {
    const { serviceId, zipCode, description, fullName, mobileNumber, email } = req.body;

    // Validation
    if (!serviceId || !zipCode || !fullName || !mobileNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: serviceId, zipCode, fullName, mobileNumber, email'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get safety advice (optional, don't fail if it doesn't work)
    let safetyAdvice = '';
    try {
      safetyAdvice = await getSafeSteps(service.title, description || 'Emergency restoration request');
    } catch (error) {
      console.warn('Could not generate safety advice:', error.message);
    }

    // Create emergency request
    const emergencyRequest = await EmergencyRequest.create({
      serviceId,
      serviceName: service.title,
      zipCode,
      description: description || '',
      fullName,
      mobileNumber,
      email,
      safetyAdvice
    });

    // Populate service details
    await emergencyRequest.populate('serviceId', 'title image description');

    // Send emails (don't fail if email sending fails)
    try {
      await sendUserConfirmationEmail(email, fullName, service.title);
      await sendOwnerNotificationEmail(emergencyRequest.toObject());
    } catch (emailError) {
      console.error('Email sending failed (but request saved):', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Emergency request submitted successfully. Confirmation email sent.',
      data: emergencyRequest
    });
  } catch (error) {
    console.error('Error creating emergency request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating emergency request',
      error: error.message
    });
  }
};

// Update emergency request status
const updateEmergencyRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'in_progress', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('serviceId', 'title image');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency request status updated',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating emergency request',
      error: error.message
    });
  }
};

// Delete emergency request
const deleteEmergencyRequest = async (req, res) => {
  try {
    const request = await EmergencyRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency request deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting emergency request',
      error: error.message
    });
  }
};

module.exports = {
  getAllEmergencyRequests,
  getEmergencyRequestById,
  createEmergencyRequest,
  updateEmergencyRequestStatus,
  deleteEmergencyRequest
};


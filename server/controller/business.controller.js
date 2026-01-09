const Business = require('../model/Business.model');
const Lead = require('../model/Lead.model');

// @desc    Get all businesses for current user
// @route   GET /api/businesses
// @access  Private
const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching businesses',
      error: error.message
    });
  }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Private
const getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching business',
      error: error.message
    });
  }
};

// @desc    Create new business (max 3 for starter plan)
// @route   POST /api/businesses
// @access  Private
const createBusiness = async (req, res) => {
  try {
    const { name, email, phone, address, industry, website, settings } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide business name and email'
      });
    }

    // Check business limit (Starter plan: max 3)
    const businessCount = await Business.countDocuments({ 
      userId: req.user.id,
      isActive: true 
    });

    if (businessCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Starter plan allows maximum 3 businesses. Upgrade to add more.'
      });
    }

    // Create business
    const business = await Business.create({
      userId: req.user.id,
      name,
      email,
      phone,
      address,
      industry,
      website,
      settings: settings || {}
    });

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating business',
      error: error.message
    });
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
const updateBusiness = async (req, res) => {
  try {
    let business = await Business.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Update fields
    const { name, email, phone, address, industry, website, settings } = req.body;
    
    if (name) business.name = name;
    if (email) business.email = email;
    if (phone !== undefined) business.phone = phone;
    if (address) business.address = address;
    if (industry !== undefined) business.industry = industry;
    if (website !== undefined) business.website = website;
    if (settings) business.settings = { ...business.settings, ...settings };

    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating business',
      error: error.message
    });
  }
};

// @desc    Delete business (soft delete)
// @route   DELETE /api/businesses/:id
// @access  Private
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Soft delete
    business.isActive = false;
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting business',
      error: error.message
    });
  }
};

// @desc    Get business stats
// @route   GET /api/businesses/:id/stats
// @access  Private
const getBusinessStats = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Get lead statistics
    const totalLeads = await Lead.countDocuments({ businessId: business._id });
    const newLeads = await Lead.countDocuments({ 
      businessId: business._id,
      status: 'new'
    });
    const emergencyLeads = await Lead.countDocuments({
      businessId: business._id,
      urgency: 'emergency'
    });
    const convertedLeads = await Lead.countDocuments({
      businessId: business._id,
      status: 'converted'
    });

    res.status(200).json({
      success: true,
      data: {
        business: {
          id: business._id,
          name: business.name
        },
        stats: {
          totalLeads,
          newLeads,
          emergencyLeads,
          convertedLeads
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching business stats',
      error: error.message
    });
  }
};

module.exports = {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessStats
};


const Service = require('../model/Service');
const path = require('path');
const fs = require('fs');

// Get all services
const getAllServices = async (req, res) => {
  try {
    // Check if Service model is available
    if (!Service) {
      throw new Error('Service model not available. Database may not be connected.');
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. Connection state: ' + mongoose.connection.readyState);
    }
    
    const services = await Service.find().sort({ createdAt: -1 });
    
    // Transform image paths to full URLs
    const servicesWithUrls = services.map(service => {
      const serviceObj = service.toObject();
      // Handle null/undefined image
      if (!serviceObj.image) {
        serviceObj.image = '';
      } else if (serviceObj.image.startsWith('http')) {
        // Already a full URL, keep as is
        serviceObj.image = serviceObj.image;
      } else {
        // Local file, construct full URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        // If image path already starts with 'uploads/', don't add it again
        if (serviceObj.image.startsWith('uploads/')) {
          serviceObj.image = `${baseUrl}/${serviceObj.image}`;
        } else {
          serviceObj.image = `${baseUrl}/uploads/${serviceObj.image}`;
        }
      }
      return serviceObj;
    });

    res.status(200).json({
      success: true,
      count: servicesWithUrls.length,
      data: servicesWithUrls
    });
  } catch (error) {
    console.error('Error in getAllServices:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Transform image path to full URL
    const serviceData = service.toObject();
    if (!serviceData.image) {
      serviceData.image = '';
    } else if (serviceData.image.startsWith('http')) {
      serviceData.image = serviceData.image;
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      if (serviceData.image.startsWith('uploads/')) {
        serviceData.image = `${baseUrl}/${serviceData.image}`;
      } else {
        serviceData.image = `${baseUrl}/uploads/${serviceData.image}`;
      }
    }

    res.status(200).json({
      success: true,
      data: serviceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    // Handle image upload
    let imagePath = '';
    if (req.file) {
      // File uploaded via multer
      imagePath = `uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Image URL provided in body
      imagePath = req.body.image;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image (file upload or image URL)'
      });
    }

    const service = await Service.create({
      image: imagePath,
      title,
      description
    });

    // Transform image path to full URL
    const serviceData = service.toObject();
    if (!serviceData.image) {
      serviceData.image = '';
    } else if (serviceData.image.startsWith('http')) {
      serviceData.image = serviceData.image;
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      if (serviceData.image.startsWith('uploads/')) {
        serviceData.image = `${baseUrl}/${serviceData.image}`;
      } else {
        serviceData.image = `${baseUrl}/uploads/${serviceData.image}`;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: serviceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Handle image update
    let imagePath = service.image; // Keep existing image by default
    
    if (req.file) {
      // Delete old image file if it exists and is not a URL
      if (service.image && !service.image.startsWith('http') && fs.existsSync(path.join(__dirname, '../', service.image))) {
        fs.unlinkSync(path.join(__dirname, '../', service.image));
      }
      // New file uploaded
      imagePath = `uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Image URL provided in body
      // Delete old image file if it exists and is not a URL
      if (service.image && !service.image.startsWith('http') && fs.existsSync(path.join(__dirname, '../', service.image))) {
        fs.unlinkSync(path.join(__dirname, '../', service.image));
      }
      imagePath = req.body.image;
    }

    // Update service
    const updateData = { image: imagePath };
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Transform image path to full URL
    const serviceData = updatedService.toObject();
    if (!serviceData.image) {
      serviceData.image = '';
    } else if (serviceData.image.startsWith('http')) {
      serviceData.image = serviceData.image;
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      if (serviceData.image.startsWith('uploads/')) {
        serviceData.image = `${baseUrl}/${serviceData.image}`;
      } else {
        serviceData.image = `${baseUrl}/uploads/${serviceData.image}`;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: serviceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete associated image file if it exists and is not a URL
    if (service.image && !service.image.startsWith('http')) {
      const imagePath = path.join(__dirname, '../', service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};


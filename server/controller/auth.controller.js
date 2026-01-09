// Ensure dotenv is loaded (in case controller is loaded before app.js)
if (!process.env.JWT_SECRET) {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
}

const User = require('../model/User.model');
const jwt = require('jsonwebtoken');

// Validate JWT_SECRET is set
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.trim() === '') {
  console.error('ERROR: JWT_SECRET is not set in .env file. Authentication will not work.');
  console.error('Please add JWT_SECRET=your_secret_key to your server/.env file');
  console.error('Current JWT_SECRET value:', jwtSecret);
}

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  console.log('DEBUG: generateToken called, JWT_SECRET exists:', !!secret, 'Length:', secret ? secret.length : 0);
  
  if (!secret || secret.trim() === '') {
    console.error('JWT_SECRET is missing or empty. Value:', secret);
    console.error('All env vars with JWT:', Object.keys(process.env).filter(k => k.includes('JWT')));
    throw new Error('JWT_SECRET is not configured. Please set JWT_SECRET in .env file and restart server');
  }
  
  try {
    return jwt.sign({ id }, secret.trim(), {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });
  } catch (error) {
    console.error('JWT sign error:', error.message);
    console.error('Secret value type:', typeof secret);
    console.error('Secret length:', secret ? secret.length : 0);
    throw error;
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    console.log('Registering user:', { name, email: normalizedEmail, passwordLength: password.length });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });
    console.log('User created successfully:', { 
      id: user._id, 
      email: user.email,
      passwordHashed: !!user.password && user.password.length > 20 // Hashed passwords are long
    });

    // Generate token
    let token;
    try {
      token = generateToken(user._id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token',
        error: tokenError.message
      });
    }

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check user and password - MUST use select('+password') to get password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    console.log('Attempting password comparison for:', normalizedEmail);
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    console.log('Login successful for:', normalizedEmail);

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Generate token
    let token;
    try {
      token = generateToken(user._id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token',
        error: tokenError.message
      });
    }

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};


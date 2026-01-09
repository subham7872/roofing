require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const appRouter = require('./routes/appRouter');

// Validate required environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file!');
  console.error('   Authentication will not work without JWT_SECRET.');
  console.error('   Please add: JWT_SECRET=your_secret_key to server/.env');
  console.error('   Then restart the server.');
  process.exit(1);
} else if (process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET is too short (' + process.env.JWT_SECRET.length + ' chars).');
  console.warn('   For security, use at least 32 characters.');
  console.warn('   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
} else {
  console.log('✅ JWT_SECRET configured (' + process.env.JWT_SECRET.length + ' characters)');
}

const app = express();

// Connect to database
const connectDB = async () => {
  try {
    // Check for both MONGO_DB_URL and MONGODB_URI (support both naming conventions)
    const mongoURI = process.env.MONGO_DB_URL || process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined. Please set MONGO_DB_URL or MONGODB_URI in .env file');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit in development - allow server to start even if DB fails
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

connectDB();

// Middleware - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      'https://lms.indiacampus.in',
      'http://lms.indiacampus.in',
      // Add production frontend URL from environment if set
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ];
    
    // Allow if origin is in allowed list OR if explicitly allowed via env OR development mode
    if (allowedOrigins.indexOf(origin) !== -1 || 
        process.env.CORS_ORIGIN === '*' || 
        process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // For JWT HTTP-only cookies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - mount router at /api prefix
app.use('/api', appRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 8088;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;


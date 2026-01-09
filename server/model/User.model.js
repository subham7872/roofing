const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password by default
  },
  plan: {
    type: String,
    enum: ['starter', 'growth', 'enterprise'],
    default: 'starter'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified and not already hashed
  if (!this.isModified('password')) return next();
  
  // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
    return next();
  }
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword) {
    console.log('comparePassword: No candidate password provided');
    return false;
  }
  
  if (!this.password) {
    console.error('comparePassword: User password is missing');
    return false;
  }
  
  // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$') && !this.password.startsWith('$2y$')) {
    console.error('comparePassword: Password is not hashed (not a bcrypt hash)');
    return false;
  }
  
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('comparePassword: Result:', result, 'Candidate length:', candidatePassword.length, 'Hash length:', this.password.length);
    return result;
  } catch (error) {
    console.error('comparePassword: Error during comparison:', error.message);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);


// Type definitions for the application

export const NavItem = {
  href: String,
  label: String
};

export const Service = {
  id: String,
  title: String,
  description: String,
  icon: String
};

export const FAQItem = {
  question: String,
  answer: String
};

export const Testimonial = {
  name: String,
  location: String,
  text: String,
  rating: Number
};

export const TrustBadge = {
  name: String,
  icon: String
};

export const ChatMessage = {
  role: String, // 'user' | 'model'
  content: String,
  timestamp: Date
};

export const DamageType = {
  WATER: 'Water',
  FIRE: 'Fire/Smoke',
  MOLD: 'Mold',
  STORM: 'Storm/Flood',
  SEWAGE: 'Sewage',
  OTHER: 'Other'
};

// Emergency Lead structure
export const EmergencyLead = {
  id: String,
  damageType: String, // DamageType value
  zipCode: String,
  phone: String,
  name: String,
  timestamp: Number
};

// Service Item structure
export const ServiceItem = {
  id: String,
  title: String,
  description: String,
  icon: String,
  image: String
};


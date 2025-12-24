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


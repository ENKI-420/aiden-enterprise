// Application Constants
export const APP_CONFIG = {
  name: 'AGENT-M3c',
  fullName: 'AGENT-M3c by Agile Defense Systems, LLC',
  description: 'Enhanced AI Secure Ops platform for mission-critical teams',
  url: 'https://agentm3c.agiledefensesystems.us',
  supportEmail: 'devin@agiledefensesystems.com',
  company: {
    name: 'Agile Defense Systems, LLC',
    cage: '9HuP5',
    certifications: ['SBA Certified', 'Service-Disabled Veteran-Owned', 'CMMC Level 3', 'NIST 800-171', 'HIPAA Compliant'],
  },
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Certifications', href: '/#certs' },
  { label: 'Research', href: '/#research' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Project Spectra', href: '/project-spectra' },
  { label: 'Agent MC3', href: '/agent-mc3' },
  { label: 'Genomic Twin', href: '/genomic-twin' },
  { label: 'SAAS Portal', href: '/saas' },
] as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: '/api/auth',
  users: '/api/users',
  agents: '/api/agents',
  analytics: '/api/analytics',
} as const;

// Feature Flags
export const FEATURES = {
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// Validation Constants
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
} as const;
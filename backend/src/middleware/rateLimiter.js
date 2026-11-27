const rateLimit = require('express-rate-limit');

// General API Rate Limiter: max 300 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Strict Auth Limiter: max 15 login attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. For security reasons, your IP is temporarily throttled. Please try again after 15 minutes.',
  },
});

// Public Form Submissions Limiter (contact messages, inquiries): max 10 submissions per 15 minutes
const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a few moments before trying again.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  publicFormLimiter,
};

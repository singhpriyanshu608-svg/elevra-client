import rateLimit from 'express-rate-limit';

/**
 * Rate limiter specifically for demo booking requests.
 * Allows max 5 submissions per 15-minute window per IP to prevent spam.
 */
export const demoRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per window
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many demo requests submitted from this network. Please wait 15 minutes or connect directly via WhatsApp.',
  },
  skip: (req) => {
    // Optional bypass in automated test environments
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * General API rate limiter for health checks and miscellaneous routes.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many API requests from this network. Please slow down.',
  },
});

import {
  FORMAT_OPTIONS,
  PREFERRED_SLOT_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '../models/DemoRequest.js';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_CLEAN_REGEX = /^[+0-9\s\-()]{7,25}$/;

/**
 * Validates incoming demo request payloads with strict typing, length limits, and honeypot detection.
 */
export const validateDemoRequest = (req, res, next) => {
  const {
    fullName,
    profession,
    email,
    whatsappNumber,
    format,
    preferredSlot,
    primaryGoal,
    company_hp, // Honeypot spam trap
  } = req.body || {};

  const errors = [];

  // Honeypot spam check: hidden field should always be empty
  if (company_hp) {
    return res.status(400).json({
      success: false,
      message: 'Spam submission detected.',
    });
  }

  // Full Name validation
  if (!fullName || typeof fullName !== 'string') {
    errors.push('Full name is required.');
  } else {
    const trimmed = fullName.trim();
    if (trimmed.length < 2) errors.push('Full name must be at least 2 characters.');
    if (trimmed.length > 80) errors.push('Full name cannot exceed 80 characters.');
  }

  // Profession / Role validation
  if (!profession || typeof profession !== 'string') {
    errors.push('Profession / role is required.');
  } else {
    const trimmed = profession.trim();
    if (trimmed.length < 2) errors.push('Profession must be at least 2 characters.');
    if (trimmed.length > 100) errors.push('Profession cannot exceed 100 characters.');
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else {
    const trimmed = email.trim();
    if (trimmed.length > 100) errors.push('Email cannot exceed 100 characters.');
    if (!EMAIL_REGEX.test(trimmed)) errors.push('Please enter a valid email address.');
  }

  // WhatsApp Number validation
  if (!whatsappNumber || typeof whatsappNumber !== 'string') {
    errors.push('WhatsApp number is required.');
  } else {
    const trimmed = whatsappNumber.trim();
    if (trimmed.length < 7 || trimmed.length > 25) {
      errors.push('WhatsApp number must be between 7 and 25 characters.');
    } else if (!PHONE_CLEAN_REGEX.test(trimmed)) {
      errors.push('WhatsApp number contains invalid characters.');
    }
  }

  // Format enum validation
  if (!format || !FORMAT_OPTIONS.includes(format)) {
    errors.push(`Format must be one of: ${FORMAT_OPTIONS.join(', ')}.`);
  }

  // Preferred Slot enum validation
  if (!preferredSlot || !PREFERRED_SLOT_OPTIONS.includes(preferredSlot)) {
    errors.push(`Preferred slot must be one of: ${PREFERRED_SLOT_OPTIONS.join(', ')}.`);
  }

  // Primary Goal enum validation
  if (!primaryGoal || !PRIMARY_GOAL_OPTIONS.includes(primaryGoal)) {
    errors.push(`Primary goal must be one of: ${PRIMARY_GOAL_OPTIONS.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  // Sanitize body before passing to controller
  req.sanitizedBody = {
    fullName: fullName.trim(),
    profession: profession.trim(),
    email: email.trim().toLowerCase(),
    whatsappNumber: whatsappNumber.trim(),
    format,
    preferredSlot,
    primaryGoal,
  };

  next();
};

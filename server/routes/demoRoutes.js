import { Router } from 'express';
import { DemoRequest } from '../models/DemoRequest.js';
import { isDbConnected } from '../config/db.js';
import { validateDemoRequest } from '../middleware/validation.js';
import { demoRateLimiter } from '../middleware/rateLimiter.js';
import { sendLeadNotification, retryPendingNotifications } from '../services/emailService.js';

export const demoRouter = Router();

/**
 * POST /api/demo-requests
 * Accepts demo booking request, validates fields, ensures MongoDB connection,
 * saves the lead, and attempts email notification with safe preservation on failure.
 */
demoRouter.post('/demo-requests', demoRateLimiter, validateDemoRequest, async (req, res, next) => {
  try {
    // 1. Strict database availability check (Requirement 1)
    if (!isDbConnected()) {
      console.warn('[DemoRequest] Rejection: MongoDB connection is not active.');
      return res.status(503).json({
        success: false,
        leadSaved: false,
        message: 'Database service is temporarily unavailable. Please try again shortly or contact us directly on WhatsApp (+91 87002 76743).',
      });
    }

    const {
      fullName,
      profession,
      email,
      whatsappNumber,
      format,
      preferredSlot,
      primaryGoal,
    } = req.sanitizedBody;

    // 2. Save lead in MongoDB with status 'new' BEFORE email delivery (Requirements 3 & 4)
    const newLead = new DemoRequest({
      fullName,
      profession,
      email,
      whatsappNumber,
      format,
      preferredSlot,
      primaryGoal,
      status: 'new',
      emailNotification: {
        status: 'pending',
        attempts: 0,
      },
    });

    await newLead.save();
    console.log(`[DemoRequest] Lead saved in database. ID: ${newLead._id}`);

    // 3. Initiate email notification via Resend with a bounded timeout
    // Database save is already committed; email attempt will not hang HTTP response
    let notificationStatus = 'pending';
    try {
      // Race email dispatch against a short 4-second timeout to guarantee fast HTTP response
      const emailPromise = sendLeadNotification(newLead);
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ timedOut: true }), 4000)
      );

      const emailOutcome = await Promise.race([emailPromise, timeoutPromise]);

      if (emailOutcome && emailOutcome.timedOut) {
        console.warn(`[DemoRequest] Email notification taking longer than 4s for lead ${newLead._id}; proceeding in background.`);
        notificationStatus = 'queued_for_retry';
      } else if (emailOutcome && emailOutcome.success) {
        notificationStatus = 'sent';
      } else {
        notificationStatus = emailOutcome?.isPermanent ? 'permanently_failed' : 'queued_for_retry';
      }
    } catch (emailErr) {
      console.error(`[DemoRequest] Unexpected error while initiating email for lead ${newLead._id}:`, emailErr.message);
      notificationStatus = 'queued_for_retry';
    }

    // 4. Return success confirmation distinguishing persistence from notification status
    return res.status(201).json({
      success: true,
      message: 'Demo request received! Our team will reach out on WhatsApp to coordinate and confirm your Google Meet slot.',
      leadId: newLead._id,
      leadSaved: true,
      notificationStatus,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/internal/retry-emails
 * Protected internal route for manual or webhook-triggered retry passes.
 * Requires x-internal-admin-key matching INTERNAL_ADMIN_KEY. (Requirement 2)
 */
demoRouter.post('/internal/retry-emails', async (req, res, next) => {
  try {
    const adminKey = req.headers['x-internal-admin-key'];
    const configuredKey = process.env.INTERNAL_ADMIN_KEY;

    if (!configuredKey || adminKey !== configuredKey) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Valid internal administrative key required.',
      });
    }

    const result = await retryPendingNotifications();
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
});

import { Resend } from 'resend';
import { DemoRequest } from '../models/DemoRequest.js';

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

// Retry backoff schedule: 1st failure = 2m, 2nd failure = 10m
const RETRY_BACKOFF_MS = [2 * 60 * 1000, 10 * 60 * 1000];
const MAX_ATTEMPTS = 3;

/**
 * Builds a styled HTML email template for coach notifications.
 */
const buildNotificationEmailHtml = (lead) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Demo Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FBF9F5; margin: 0; padding: 24px; color: #1F1B18; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E8E1D7; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: #191614; color: #ffffff; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #DFC4A8; text-transform: uppercase; letter-spacing: 0.08em; }
    .body { padding: 32px; }
    .lead-badge { display: inline-block; background: #F5EDE4; color: #8F5E33; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 99px; text-transform: uppercase; margin-bottom: 20px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .data-table th, .data-table td { padding: 12px 14px; text-align: left; font-size: 14.5px; border-bottom: 1px solid #F4EFEB; vertical-align: top; }
    .data-table th { width: 36%; color: #847D75; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .data-table td { color: #1F1B18; font-weight: 600; }
    .data-table td a { color: #B47B49; text-decoration: none; }
    .footer { background: #F4EFEB; padding: 18px 32px; font-size: 12px; color: #847D75; border-top: 1px solid #E8E1D7; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Elevra Demo Booking</h1>
      <p>English With Kanika · Lead Notification</p>
    </div>
    <div class="body">
      <div class="lead-badge">Format: ${lead.format}</div>
      <table class="data-table">
        <tr>
          <th>Full Name</th>
          <td>${lead.fullName}</td>
        </tr>
        <tr>
          <th>Profession / Role</th>
          <td>${lead.profession}</td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <th>WhatsApp Number</th>
          <td><a href="https://wa.me/${lead.whatsappNumber.replace(/[^0-9]/g, '')}">${lead.whatsappNumber}</a></td>
        </tr>
        <tr>
          <th>Preferred Slot</th>
          <td>${lead.preferredSlot}</td>
        </tr>
        <tr>
          <th>Primary Goal</th>
          <td>${lead.primaryGoal}</td>
        </tr>
        <tr>
          <th>Received At</th>
          <td>${new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      This is an automated notification from the Elevra Web Platform.
    </div>
  </div>
</body>
</html>
  `.trim();
};

const buildNotificationEmailText = (lead) => {
  return `
NEW ELEVRA DEMO BOOKING
=======================
Format: ${lead.format}

Full Name: ${lead.fullName}
Profession: ${lead.profession}
Email: ${lead.email}
WhatsApp: ${lead.whatsappNumber}
Preferred Slot: ${lead.preferredSlot}
Primary Goal: ${lead.primaryGoal}
Received At: ${new Date(lead.createdAt || Date.now()).toISOString()}

Lead ID: ${lead._id}
  `.trim();
};

/**
 * Sends lead email notification via Resend.
 * Updates the lead document with delivery result.
 * @param {object} lead - Mongoose DemoRequest document
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendLeadNotification = async (lead) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.VERIFIED_FROM_EMAIL;
  const coachEmail = process.env.COACH_EMAIL;

  const currentAttempts = (lead.emailNotification?.attempts || 0) + 1;
  const isPermanentlyFailed = currentAttempts >= MAX_ATTEMPTS;
  const backoffIndex = Math.min(Math.max(currentAttempts - 1, 0), RETRY_BACKOFF_MS.length - 1);
  const nextRetryMs = RETRY_BACKOFF_MS[backoffIndex];

  if (!apiKey || !fromEmail || !coachEmail) {
    const errorMsg = 'Email service credentials not configured (RESEND_API_KEY, VERIFIED_FROM_EMAIL, or COACH_EMAIL missing).';
    console.warn(`[EmailService] Notification deferred for lead ${lead._id}: ${errorMsg}`);

    lead.emailNotification = {
      status: isPermanentlyFailed ? 'permanently_failed' : 'failed',
      attempts: currentAttempts,
      error: errorMsg.slice(0, 300),
      nextRetryAt: isPermanentlyFailed ? null : new Date(Date.now() + nextRetryMs),
    };
    await lead.save();
    return { success: false, error: errorMsg };
  }

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: fromEmail,
      to: coachEmail,
      subject: `New Demo Request: ${lead.fullName} (${lead.format})`,
      html: buildNotificationEmailHtml(lead),
      text: buildNotificationEmailText(lead),
    });

    if (result.error) {
      const err = new Error(result.error.message || 'Resend API returned error');
      err.statusCode = result.error.statusCode;
      err.name = result.error.name;
      throw err;
    }

    console.log(`[EmailService] Notification delivered for lead ${lead._id}.`);

    lead.emailNotification = {
      status: 'sent',
      sentAt: new Date(),
      error: null,
      attempts: currentAttempts,
      nextRetryAt: null,
    };
    await lead.save();

    return { success: true };
  } catch (err) {
    const rawError = err.message || 'Unknown email delivery error';
    const statusCode = err.statusCode || err.status;
    
    // Detect permanent non-retryable errors (e.g., invalid API key, unverified domain, Resend testing email restriction)
    const isPermanentRestriction =
      statusCode === 401 ||
      statusCode === 403 ||
      rawError.includes('You can only send testing emails to your own email address') ||
      rawError.includes('verify a domain at resend.com') ||
      rawError.includes('API key is invalid') ||
      rawError.includes('validation_error');

    const isPermanentlyFailed = isPermanentRestriction || currentAttempts >= MAX_ATTEMPTS;
    const backoffIndex = Math.min(Math.max(currentAttempts - 1, 0), RETRY_BACKOFF_MS.length - 1);
    const nextRetryMs = RETRY_BACKOFF_MS[backoffIndex];

    console.error(
      `[EmailService] Failed to send notification for lead ${lead._id} (attempt ${currentAttempts}/${MAX_ATTEMPTS}${isPermanentRestriction ? ' - permanent restriction detected' : ''}):`,
      rawError
    );

    lead.emailNotification = {
      status: isPermanentlyFailed ? 'permanently_failed' : 'failed',
      attempts: currentAttempts,
      error: rawError.slice(0, 300),
      nextRetryAt: isPermanentlyFailed ? null : new Date(Date.now() + nextRetryMs),
    };
    await lead.save();

    return { success: false, error: rawError, isPermanent: isPermanentlyFailed };
  }
};

/**
 * Scheduled retry function to process pending or failed email notifications.
 */
export const retryPendingNotifications = async () => {
  if (!process.env.RESEND_API_KEY || !process.env.VERIFIED_FROM_EMAIL || !process.env.COACH_EMAIL) {
    return { processed: 0, successful: 0, reason: 'Email service credentials not configured' };
  }

  try {
    const pendingLeads = await DemoRequest.find({
      'emailNotification.status': 'failed',
      'emailNotification.attempts': { $lt: MAX_ATTEMPTS },
      'emailNotification.nextRetryAt': { $lte: new Date() },
    }).limit(10);

    if (pendingLeads.length === 0) {
      return { processed: 0, successful: 0 };
    }

    console.log(`[EmailService Worker] Retrying ${pendingLeads.length} failed notifications...`);
    let successful = 0;

    for (const lead of pendingLeads) {
      const outcome = await sendLeadNotification(lead);
      if (outcome.success) {
        successful += 1;
      }
    }

    return { processed: pendingLeads.length, successful };
  } catch (err) {
    console.error('[EmailService Worker] Error during retry pass:', err.message);
    return { processed: 0, successful: 0, error: err.message };
  }
};

/**
 * Starts background retry worker interval.
 */
export const startEmailRetryWorker = (intervalMs = 2 * 60 * 1000) => {
  const timer = setInterval(() => {
    retryPendingNotifications().catch((err) => {
      console.error('[EmailService Worker] Uncaught error in retry interval:', err.message);
    });
  }, intervalMs);

  // Allow process to exit cleanly without waiting on interval
  if (timer.unref) {
    timer.unref();
  }

  console.log(`[EmailService] Background retry worker started (interval: ${intervalMs / 1000}s).`);
  return timer;
};

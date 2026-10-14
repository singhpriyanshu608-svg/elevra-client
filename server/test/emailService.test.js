import test from 'node:test';
import assert from 'node:assert/strict';
import { sendLeadNotification } from '../services/emailService.js';

test('sendLeadNotification safely handles missing credentials without crashing (Requirement 7)', async () => {
  // Ensure credentials are empty for this test
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  let saved = false;
  const mockLead = {
    _id: 'mock_lead_123',
    fullName: 'Test Candidate',
    email: 'test@candidate.com',
    format: '1-on-1 VIP Mentorship',
    emailNotification: {
      status: 'pending',
      attempts: 0,
    },
    save: async function () {
      saved = true;
      return this;
    },
  };

  const result = await sendLeadNotification(mockLead);

  assert.equal(result.success, false);
  assert.ok(result.error);
  assert.equal(mockLead.emailNotification.status, 'failed');
  assert.equal(mockLead.emailNotification.attempts, 1);
  assert.ok(mockLead.emailNotification.nextRetryAt instanceof Date);
  assert.equal(saved, true, 'Lead must be preserved and saved even when email delivery fails');

  // Restore env if it was present
  if (originalKey) process.env.RESEND_API_KEY = originalKey;
});

test('sendLeadNotification marks as permanently_failed after 3 attempts with bounded retry (Requirement 5)', async () => {
  delete process.env.RESEND_API_KEY;

  const mockLead = {
    _id: 'mock_lead_max_attempts',
    fullName: 'Test Candidate',
    email: 'test@candidate.com',
    format: 'Executive Group Cohort',
    emailNotification: {
      status: 'failed',
      attempts: 2, // Next attempt will be 3 (max)
    },
    save: async function () {
      return this;
    },
  };

  const result = await sendLeadNotification(mockLead);

  assert.equal(result.success, false);
  assert.equal(mockLead.emailNotification.status, 'permanently_failed');
  assert.equal(mockLead.emailNotification.attempts, 3);
  assert.equal(mockLead.emailNotification.nextRetryAt, null);
});

test('sendLeadNotification marks as permanently_failed immediately on permanent Resend restriction', async () => {
  process.env.RESEND_API_KEY = 're_test_key_mock';
  process.env.VERIFIED_FROM_EMAIL = 'onboarding@resend.dev';
  process.env.COACH_EMAIL = 'recipient@test.com';

  const mockLead = {
    _id: 'mock_lead_permanent_restriction',
    fullName: 'Test Candidate',
    email: 'test@candidate.com',
    whatsappNumber: '+919876543210',
    format: '1-on-1 VIP Mentorship',
    preferredSlot: 'Morning (9:00 AM – 12:00 PM)',
    primaryGoal: 'Freezing under pressure in meetings',
    emailNotification: {
      status: 'pending',
      attempts: 0,
    },
    save: async function () {
      return this;
    },
  };

  // The actual Resend client in dev with testing key throws "You can only send testing emails to your own email address"
  const result = await sendLeadNotification(mockLead);

  assert.equal(result.success, false);
  assert.equal(mockLead.emailNotification.status, 'permanently_failed');
  assert.equal(mockLead.emailNotification.nextRetryAt, null);
  assert.equal(result.isPermanent, true);
});

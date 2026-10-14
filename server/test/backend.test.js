import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../index.js';
import {
  FORMAT_OPTIONS,
  PREFERRED_SLOT_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '../models/DemoRequest.js';

import mongoose from 'mongoose';

let testServer;
let baseUrl;

// Start a test server on a random port
test.before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    testServer = http.createServer(app);
    testServer.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    testServer.close(resolve);
  });
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

test('GET /api/health responds with status and database state', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();
  assert.ok(data.status, 'Expected status field in response');
  assert.ok(data.database, 'Expected database field in response');
  assert.equal(typeof data.uptimeSeconds, 'number');
});

test('POST /api/demo-requests validates required fields', async () => {
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.errors.length >= 4, 'Expected errors for missing required fields');
});

test('POST /api/demo-requests rejects invalid email format', async () => {
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Rahul Sharma',
      profession: 'Software Engineer',
      email: 'invalid-email-address',
      whatsappNumber: '+91 98765 43210',
      format: FORMAT_OPTIONS[0],
      preferredSlot: PREFERRED_SLOT_OPTIONS[0],
      primaryGoal: PRIMARY_GOAL_OPTIONS[0],
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.errors.some((e) => e.includes('valid email address')));
});

test('POST /api/demo-requests rejects invalid dropdown options', async () => {
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Rahul Sharma',
      profession: 'Software Engineer',
      email: 'rahul@example.com',
      whatsappNumber: '+91 98765 43210',
      format: 'Invalid Track Format',
      preferredSlot: 'Anytime',
      primaryGoal: 'Learn fast',
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.errors.some((e) => e.includes('Format must be one of')));
  assert.ok(data.errors.some((e) => e.includes('Preferred slot must be one of')));
  assert.ok(data.errors.some((e) => e.includes('Primary goal must be one of')));
});

test('POST /api/demo-requests enforces field length limits', async () => {
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'A'.repeat(85), // Exceeds 80 chars
      profession: 'B'.repeat(105), // Exceeds 100 chars
      email: 'user@example.com',
      whatsappNumber: '1'.repeat(30), // Exceeds 25 chars
      format: FORMAT_OPTIONS[0],
      preferredSlot: PREFERRED_SLOT_OPTIONS[0],
      primaryGoal: PRIMARY_GOAL_OPTIONS[0],
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.errors.some((e) => e.includes('Full name cannot exceed 80 characters.')));
  assert.ok(data.errors.some((e) => e.includes('Profession cannot exceed 100 characters.')));
  assert.ok(data.errors.some((e) => e.includes('WhatsApp number must be between 7 and 25 characters.')));
});

test('POST /api/demo-requests triggers honeypot rejection when company_hp is present', async () => {
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Spam Bot',
      profession: 'Bot Worker',
      email: 'bot@spam.com',
      whatsappNumber: '+91 9999999999',
      format: FORMAT_OPTIONS[0],
      preferredSlot: PREFERRED_SLOT_OPTIONS[0],
      primaryGoal: PRIMARY_GOAL_OPTIONS[0],
      company_hp: 'Malicious Corp Ltd', // Honeypot filled
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Spam submission detected.');
});

test('POST /api/demo-requests returns 503 when database is not connected (Requirement 1)', async () => {
  // In test environment without active MongoDB connection, it must reject with 503
  const res = await fetch(`${baseUrl}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Priyanshu Singh',
      profession: 'Senior Product Manager',
      email: 'priyanshu@example.com',
      whatsappNumber: '+91 98765 43210',
      format: FORMAT_OPTIONS[0],
      preferredSlot: PREFERRED_SLOT_OPTIONS[0],
      primaryGoal: PRIMARY_GOAL_OPTIONS[0],
    }),
  });

  // Since MONGODB_URI is not set in this test run, it must return 503
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.leadSaved, false);
  assert.ok(data.message.includes('Database service is temporarily unavailable'));
});

test('POST /api/internal/retry-emails rejects requests without valid admin key (Requirement 2)', async () => {
  process.env.INTERNAL_ADMIN_KEY = 'test_secret_admin_key_123';

  const res = await fetch(`${baseUrl}/api/internal/retry-emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.ok(data.message.includes('Valid internal administrative key required'));
});

test('POST /api/internal/retry-emails accepts requests with valid admin key', async () => {
  process.env.INTERNAL_ADMIN_KEY = 'test_secret_admin_key_123';

  const res = await fetch(`${baseUrl}/api/internal/retry-emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-admin-key': 'test_secret_admin_key_123',
    },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.result);
});

test('Backend dropdown enums strictly cover frontend form specifications (Requirement 6)', () => {
  assert.deepEqual(FORMAT_OPTIONS, [
    '1-on-1 VIP Mentorship',
    'Executive Group Cohort',
  ]);

  assert.deepEqual(PREFERRED_SLOT_OPTIONS, [
    'Morning (9:00 AM – 12:00 PM)',
    'Evening (6:00 PM – 9:00 PM)',
    'Weekend Batch',
  ]);

  assert.deepEqual(PRIMARY_GOAL_OPTIONS, [
    'Freezing under pressure in meetings',
    'Executive tone and leadership presence',
    'Client presentations & interviews',
    'Concise email writing & updates',
    'Overcoming mother-tongue translation',
  ]);
});


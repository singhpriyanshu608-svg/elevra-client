import mongoose from 'mongoose';

export const FORMAT_OPTIONS = [
  '1-on-1 VIP Mentorship',
  'Executive Group Cohort',
];

export const PREFERRED_SLOT_OPTIONS = [
  'Morning (9:00 AM – 12:00 PM)',
  'Evening (6:00 PM – 9:00 PM)',
  'Weekend Batch',
];

export const PRIMARY_GOAL_OPTIONS = [
  'Freezing under pressure in meetings',
  'Executive tone and leadership presence',
  'Client presentations & interviews',
  'Concise email writing & updates',
  'Overcoming mother-tongue translation',
];

const demoRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    profession: {
      type: String,
      required: [true, 'Profession / role is required'],
      trim: true,
      minlength: [2, 'Profession must be at least 2 characters'],
      maxlength: [100, 'Profession cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
      minlength: [7, 'WhatsApp number must be at least 7 characters'],
      maxlength: [25, 'WhatsApp number cannot exceed 25 characters'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
      enum: {
        values: FORMAT_OPTIONS,
        message: 'Invalid format selection',
      },
    },
    preferredSlot: {
      type: String,
      required: [true, 'Preferred slot is required'],
      enum: {
        values: PREFERRED_SLOT_OPTIONS,
        message: 'Invalid preferred slot selection',
      },
    },
    primaryGoal: {
      type: String,
      required: [true, 'Primary goal is required'],
      enum: {
        values: PRIMARY_GOAL_OPTIONS,
        message: 'Invalid primary goal selection',
      },
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'completed', 'cancelled'],
      default: 'new',
      index: true,
    },
    emailNotification: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'permanently_failed'],
        default: 'pending',
        index: true,
      },
      sentAt: {
        type: Date,
      },
      error: {
        type: String,
        maxlength: 300,
      },
      attempts: {
        type: Number,
        default: 0,
      },
      nextRetryAt: {
        type: Date,
        index: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

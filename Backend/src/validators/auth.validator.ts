import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your full name.')
    .min(2, 'Full name must contain at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Please enter a password.')
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Please enter your password.'),
  expectedRole: z.enum(['user', 'doctor', 'admin']),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  otp: z
    .string()
    .trim()
    .min(1, 'Please enter the verification code.')
    .length(6, 'Verification code must be exactly 6 digits.'),
  purpose: z
    .string()
    .trim()
    .min(1, 'Verification purpose is required.'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, 'Please enter your new password.')
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  purpose: z
    .string()
    .trim()
    .min(1, 'Verification purpose is required.'),
});

export const onboardingSchema = z.object({
  onboardingType: z.enum(['pregnant', 'trying', 'doctor', 'exploring']).nullable().optional(),
});

const parseUtcDateOnly = (val: string): number | null => {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    const timestamp = Date.UTC(y, m, d);
    if (!isNaN(timestamp)) return timestamp;
  }
  const parsed = Date.parse(trimmed);
  if (isNaN(parsed)) return null;
  const dateObj = new Date(parsed);
  return Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
};

export const pregnancyLmpSchema = z.object({
  lmpDate: z
    .string()
    .min(1, 'Please enter your last menstrual period date.')
    .refine((val) => parseUtcDateOnly(val) !== null, {
      message: 'Please enter a valid date.',
    })
    .refine(
      (val) => {
        const utcTimestamp = parseUtcDateOnly(val);
        if (utcTimestamp === null) return false;
        const now = new Date();
        const currentUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        return utcTimestamp <= currentUtc;
      },
      {
        message: 'LMP cannot be a future date.',
      }
    )
    .refine(
      (val) => {
        const utcTimestamp = parseUtcDateOnly(val);
        if (utcTimestamp === null) return false;
        const now = new Date();
        const currentUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const maxPast = 42 * 7 * 24 * 60 * 60 * 1000;
        return currentUtc - utcTimestamp <= maxPast;
      },
      {
        message: 'LMP date cannot be more than 42 weeks ago.',
      }
    ),
});

export const cycleInfoSchema = z.object({
  periodStartDate: z
    .string()
    .min(1, 'Please enter the first day of your last period.')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid period date.',
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Period start date cannot be in the future.',
    })
    .refine(
      (val) => {
        const now = new Date();
        const maxPast = 90 * 24 * 60 * 60 * 1000;
        return now.getTime() - new Date(val).getTime() <= maxPast;
      },
      {
        message: 'Period start date cannot be more than 90 days ago.',
      }
    ),
  cycleLength: z
    .number()
    .min(20, 'Cycle length must be at least 20 days.')
    .max(50, 'Cycle length cannot exceed 50 days.')
    .optional()
    .default(28),
  periodLength: z
    .number()
    .min(2, 'Period length must be at least 2 days.')
    .max(12, 'Period length cannot exceed 12 days.')
    .optional()
    .default(5),
});

export const emergencyContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter the contact's name.")
    .max(100, 'Name cannot exceed 100 characters.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Please enter a phone number.')
    .min(6, 'Please enter a valid phone number (at least 6 digits).')
    .max(25, 'Phone number cannot exceed 25 characters.')
    .regex(/^[0-9+\s()-]+$/, 'Please enter a valid phone number.'),
  relationship: z.enum(
    [
      'Parent',
      'Husband / Spouse',
      'Partner',
      'Family Member',
      'Friend',
      'Other',
    ],
    {
      message: 'Please select a relationship.',
    }
  ),
});

export const emergencyContactParamSchema = z.object({
  contactId: z
    .string()
    .min(1, 'Contact ID is required.')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid emergency contact ID.'),
});

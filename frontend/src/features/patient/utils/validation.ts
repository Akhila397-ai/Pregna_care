import { z } from 'zod';

export interface EmergencyContactErrors {
  name?: string;
  phoneNumber?: string;
  relationship?: string;
}

export interface PregnancyLmpErrors {
  lmpDate?: string;
}

export interface CycleInfoErrors {
  periodStartDate?: string;
  cycleLength?: string;
  periodLength?: string;
}

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
    .min(1, 'Please select the start date of your last period.')
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
    .optional(),
  periodLength: z
    .number()
    .min(2, 'Period length must be at least 2 days.')
    .max(12, 'Period length cannot exceed 12 days.')
    .optional(),
});

export const validateEmergencyContact = (data: {
  name: string;
  phoneNumber: string;
  relationship: string;
}): EmergencyContactErrors => {
  const result = emergencyContactSchema.safeParse(data);
  if (result.success) return {};

  const errors: EmergencyContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof EmergencyContactErrors;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
};

export const validatePregnancyLmp = (lmpDate: string): PregnancyLmpErrors => {
  const result = pregnancyLmpSchema.safeParse({ lmpDate });
  if (result.success) return {};

  const errors: PregnancyLmpErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof PregnancyLmpErrors;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
};

export const validateCycleInfo = (data: {
  periodStartDate: string;
  cycleLength?: number;
  periodLength?: number;
}): CycleInfoErrors => {
  const result = cycleInfoSchema.safeParse(data);
  if (result.success) return {};

  const errors: CycleInfoErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof CycleInfoErrors;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
};

export const hasErrors = (errors: object): boolean => {
  return Object.keys(errors).length > 0;
};

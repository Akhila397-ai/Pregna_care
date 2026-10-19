import { z } from 'zod';

export interface SignupFields {
  name: string;
  email: string;
  password: string;
}

export interface SigninFields {
  email: string;
  password: string;
}

export const sharedSignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const sharedSigninSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required'),
});

export const validateSignup = (fields: SignupFields): string => {
  const result = sharedSignupSchema.safeParse(fields);
  if (result.success) return '';
  return result.error.issues[0]?.message || 'Invalid data';
};

export const validateSignin = (fields: SigninFields): string => {
  const result = sharedSigninSchema.safeParse(fields);
  if (result.success) return '';
  return result.error.issues[0]?.message || 'Invalid data';
};

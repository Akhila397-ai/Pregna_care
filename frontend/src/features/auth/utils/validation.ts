import { z } from 'zod';

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export interface OTPErrors {
  otp?: string;
}

export interface ForgotPasswordErrors {
  email?: string;
}

export interface ResetPasswordErrors {
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, 'Please enter the otp')
    .length(6, 'Please enter the complete 6-digit otp'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address required')
    .email('Please enter valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password required')
      .min(8, 'Password must be atleast 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please fill all the fields'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

export const validateRegister = (
  name: string,
  email: string,
  password: string
): RegisterErrors => {
  const result = registerSchema.safeParse({ name, email, password });
  if (result.success) return {};
  const errors: RegisterErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RegisterErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const validateLogin = (
  email: string,
  password: string
): LoginErrors => {
  const result = loginSchema.safeParse({ email, password });
  if (result.success) return {};
  const errors: LoginErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof LoginErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const validateOTP = (otp: string): OTPErrors => {
  const result = otpSchema.safeParse({ otp });
  if (result.success) return {};
  const errors: OTPErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof OTPErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const validateForgotPassword = (email: string): ForgotPasswordErrors => {
  const result = forgotPasswordSchema.safeParse({ email });
  if (result.success) return {};
  const errors: ForgotPasswordErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ForgotPasswordErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const validateResetPassword = (
  password: string,
  confirmPassword: string
): ResetPasswordErrors => {
  if (!password || !confirmPassword) {
    const errors: ResetPasswordErrors = {};
    if (!password) errors.password = 'Password required';
    if (!confirmPassword) errors.confirmPassword = 'Please fill all the fields';
    return errors;
  }
  const result = resetPasswordSchema.safeParse({ password, confirmPassword });
  if (result.success) return {};
  const errors: ResetPasswordErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ResetPasswordErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const hasErrors = (errors: object): boolean => {
  return Object.keys(errors).length > 0;
};
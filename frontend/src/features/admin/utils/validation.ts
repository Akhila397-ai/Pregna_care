import { z } from 'zod';

export interface AdminLoginErrors {
  email?: string;
  password?: string;
}

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please enter a valid email.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
});

export const validateAdminLogin = (
  email: string,
  password: string
): AdminLoginErrors => {
  const result = adminLoginSchema.safeParse({ email, password });
  if (result.success) return {};

  const errors: AdminLoginErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof AdminLoginErrors;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

export const hasErrors = (errors: object): boolean =>
  Object.keys(errors).length > 0;
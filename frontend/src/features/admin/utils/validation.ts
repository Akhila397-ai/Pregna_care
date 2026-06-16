export interface AdminLoginErrors {
  email?:    string;
  password?: string;
}

export const validateAdminLogin = (
  email:    string,
  password: string
): AdminLoginErrors => {
  const errors: AdminLoginErrors = {};

  if (!email.trim())
    errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Please enter a valid email.';

  if (!password)
    errors.password = 'Password is required.';

  return errors;
};

export const hasErrors = (errors: object): boolean =>
  Object.keys(errors).length > 0;
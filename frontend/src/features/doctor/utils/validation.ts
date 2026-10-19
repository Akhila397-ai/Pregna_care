import { z } from 'zod';

export interface DoctorApplyErrors {
  fullName?: string;
  specialization?: string;
  qualification?: string;
  experience?: string;
  registrationNumber?: string;
  consultationFee?: string;
  clinicName?: string;
  clinicAddress?: string;
  profileImage?: string;
  degreeCertificate?: string;
  registrationCertificate?: string;
  governmentId?: string;
  days?: string;
  startTime?: string;
  endTime?: string;
}

export const doctorStep1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Please enter your full name.')
    .min(2, 'Full name must contain at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  specialization: z
    .string()
    .trim()
    .min(1, 'Please select your medical specialization.'),
  qualification: z
    .string()
    .trim()
    .min(1, 'Please enter your qualification (e.g. MBBS, MD).'),
  experience: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(0, 'Years of experience cannot be negative.')
  ),
  registrationNumber: z
    .string()
    .trim()
    .min(1, 'Please enter your medical registration number.'),
  consultationFee: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(0, 'Consultation fee cannot be negative.')
  ),
});

export const doctorStep2Schema = z.object({
  clinicName: z
    .string()
    .trim()
    .min(1, 'Please enter your clinic or hospital name.')
    .min(2, 'Clinic/Hospital name must contain at least 2 characters.'),
  clinicAddress: z
    .string()
    .trim()
    .min(1, 'Please enter your clinic address.')
    .min(2, 'Clinic address must contain at least 2 characters.'),
});

export const doctorStep3Schema = z.object({
  profileImage: z
    .any()
    .refine((val) => Boolean(val), { message: 'Profile photo is required.' }),
  degreeCertificate: z
    .any()
    .refine((val) => Boolean(val), { message: 'Medical degree certificate is required.' }),
  registrationCertificate: z
    .any()
    .refine((val) => Boolean(val), { message: 'Registration certificate is required.' }),
  governmentId: z
    .any()
    .refine((val) => Boolean(val), { message: 'Government ID is required.' }),
  availability: z.object({
    days: z
      .array(z.string())
      .min(1, 'Please select at least one available day.'),
    startTime: z
      .string()
      .min(1, 'Please select your start time.'),
    endTime: z
      .string()
      .min(1, 'Please select your end time.'),
  }),
});

export const validateDoctorStep = (
  step: number,
  data: Record<string, any>
): Record<string, string> => {
  let result;
  if (step === 1) {
    result = doctorStep1Schema.safeParse(data);
  } else if (step === 2) {
    result = doctorStep2Schema.safeParse(data);
  } else if (step === 3) {
    result = doctorStep3Schema.safeParse(data);
  } else {
    return {};
  }

  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key === 'availability' && issue.path[1]) {
      const subKey = issue.path[1];
      if (typeof subKey === 'string' && !errors[subKey]) {
        errors[subKey] = issue.message;
      }
    } else if (typeof key === 'string' && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
};

export const hasErrors = (errors: object): boolean => {
  return Object.keys(errors).length > 0;
};
import { z } from 'zod';

export const userIdParamSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required.')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format.'),
});

export const doctorIdParamSchema = z.object({
  doctorId: z
    .string()
    .min(1, 'Doctor ID is required.')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid doctor ID format.'),
});

export const getDoctorDocumentParamSchema = z.object({
  doctorId: z
    .string()
    .min(1, 'Doctor ID is required.')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid doctor ID format.'),
documentType: z.enum(
  [
    'degreeCertificate',
    'registrationCertificate',
    'governmentId',
  ],
  {
    message: 'Invalid document type requested.',
  }
),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1.').optional().default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1.').max(100, 'Limit cannot exceed 100.').optional().default(10),
  search: z.string().trim().optional(),
  filter: z.string().trim().optional(),
});

export const rejectDoctorSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, 'Rejection reason must be at least 3 characters.')
    .optional(),
});

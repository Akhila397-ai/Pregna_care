import { z } from 'zod';
export const applyDoctorSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, 'Please enter your full name.')
        .min(2, 'Full name must contain at least 2 characters.')
        .max(100, 'Full name cannot exceed 100 characters.'),
    specialization: z
        .string()
        .trim()
        .min(1, 'Please select or enter your medical specialization.')
        .min(2, 'Specialization must contain at least 2 characters.'),
    qualification: z
        .string()
        .trim()
        .min(1, 'Please enter your medical qualification (e.g., MBBS, MD).')
        .min(2, 'Qualification must contain at least 2 characters.'),
    experience: z.coerce
        .number()
        .min(0, 'Years of experience cannot be negative.'),
    registrationNumber: z
        .string()
        .trim()
        .min(1, 'Please enter your medical registration number.')
        .min(2, 'Medical registration number must contain at least 2 characters.'),
    consultationFee: z.coerce
        .number()
        .min(0, 'Consultation fee cannot be negative.'),
    clinicName: z
        .string()
        .trim()
        .min(1, 'Please enter your clinic or hospital name.')
        .min(2, 'Clinic/Hospital name must contain at least 2 characters.'),
    clinicAddress: z
        .string()
        .trim()
        .min(1, 'Please enter your clinic or hospital address.')
        .min(2, 'Clinic address must contain at least 2 characters.'),
    availability: z.object({
        days: z
            .array(z.string())
            .min(1, 'Please select at least one available day.'),
        startTime: z
            .string()
            .min(1, 'Please enter your available start time.'),
        endTime: z
            .string()
            .min(1, 'Please enter your available end time.'),
    }),
});
export const bookAppointmentSchema = z.object({
    doctorId: z
        .string()
        .trim()
        .min(1, 'Please select a doctor.'),
    appointmentDate: z
        .string()
        .min(1, 'Please select an appointment date.')
        .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Please enter a valid appointment date.',
    }),
    timeSlot: z
        .string()
        .trim()
        .min(1, 'Please select a time slot.'),
    reason: z
        .string()
        .trim()
        .max(500, 'Reason cannot exceed 500 characters.')
        .optional(),
});
export const completeAppointmentSchema = z.object({
    consultationNotes: z
        .string()
        .trim()
        .max(2000, 'Consultation notes cannot exceed 2000 characters.')
        .optional(),
    prescription: z
        .string()
        .trim()
        .max(2000, 'Prescription cannot exceed 2000 characters.')
        .optional(),
});
export const cancelAppointmentSchema = z.object({
    cancelReason: z
        .string()
        .trim()
        .max(500, 'Cancellation reason cannot exceed 500 characters.')
        .optional(),
});
export const requestPrimaryDoctorSchema = z.object({
    doctorId: z
        .string()
        .trim()
        .min(1, 'Please select a doctor.'),
});
export const respondPrimaryDoctorRequestSchema = z.object({
    action: z.enum(['accept', 'decline']),
    reason: z
        .string()
        .trim()
        .max(500, 'Reason cannot exceed 500 characters.')
        .optional(),
});
export const submitDoctorReportSchema = z.object({
    doctorId: z
        .string()
        .trim()
        .min(1, 'Doctor ID is required.'),
    appointmentId: z
        .string()
        .trim()
        .optional(),
    reason: z.enum([
        'unprofessional_behavior',
        'missed_appointment',
        'incorrect_prescription',
        'billing_issue',
        'other',
    ], {
        message: 'Please select a valid report reason.',
    }),
    description: z
        .string()
        .trim()
        .min(1, 'Please describe the issue.')
        .min(5, 'Description must contain at least 5 characters.')
        .max(2000, 'Description cannot exceed 2000 characters.'),
});
export const resolveDoctorReportSchema = z.object({
    adminRemarks: z
        .string()
        .trim()
        .min(1, 'Admin remarks are required.')
        .max(1000, 'Remarks cannot exceed 1000 characters.'),
});
//# sourceMappingURL=doctor.validator.js.map
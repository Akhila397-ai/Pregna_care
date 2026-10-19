import { z } from 'zod';
export declare const applyDoctorSchema: z.ZodObject<{
    fullName: z.ZodString;
    specialization: z.ZodString;
    qualification: z.ZodString;
    experience: z.ZodCoercedNumber<unknown>;
    registrationNumber: z.ZodString;
    consultationFee: z.ZodCoercedNumber<unknown>;
    clinicName: z.ZodString;
    clinicAddress: z.ZodString;
    availability: z.ZodObject<{
        days: z.ZodArray<z.ZodString>;
        startTime: z.ZodString;
        endTime: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const bookAppointmentSchema: z.ZodObject<{
    doctorId: z.ZodString;
    appointmentDate: z.ZodString;
    timeSlot: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const completeAppointmentSchema: z.ZodObject<{
    consultationNotes: z.ZodOptional<z.ZodString>;
    prescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const cancelAppointmentSchema: z.ZodObject<{
    cancelReason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const requestPrimaryDoctorSchema: z.ZodObject<{
    doctorId: z.ZodString;
}, z.core.$strip>;
export declare const respondPrimaryDoctorRequestSchema: z.ZodObject<{
    action: z.ZodEnum<{
        accept: "accept";
        decline: "decline";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const submitDoctorReportSchema: z.ZodObject<{
    doctorId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<{
        unprofessional_behavior: "unprofessional_behavior";
        missed_appointment: "missed_appointment";
        incorrect_prescription: "incorrect_prescription";
        billing_issue: "billing_issue";
        other: "other";
    }>;
    description: z.ZodString;
}, z.core.$strip>;
export declare const resolveDoctorReportSchema: z.ZodObject<{
    adminRemarks: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=doctor.validator.d.ts.map
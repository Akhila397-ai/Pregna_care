import { z } from 'zod';
export declare const userIdParamSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export declare const doctorIdParamSchema: z.ZodObject<{
    doctorId: z.ZodString;
}, z.core.$strip>;
export declare const getDoctorDocumentParamSchema: z.ZodObject<{
    doctorId: z.ZodString;
    documentType: z.ZodEnum<{
        profileImage: "profileImage";
        governmentId: "governmentId";
        medicalDegree: "medicalDegree";
        medicalRegistration: "medicalRegistration";
        clinicEstablishment: "clinicEstablishment";
    }>;
}, z.core.$strip>;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    search: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const rejectDoctorSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=admin.validator.d.ts.map
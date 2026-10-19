import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    expectedRole: z.ZodEnum<{
        user: "user";
        admin: "admin";
        doctor: "doctor";
    }>;
}, z.core.$strip>;
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
    purpose: z.ZodString;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const resendOtpSchema: z.ZodObject<{
    email: z.ZodString;
    purpose: z.ZodString;
}, z.core.$strip>;
export declare const onboardingSchema: z.ZodObject<{
    onboardingType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        doctor: "doctor";
        pregnant: "pregnant";
        trying: "trying";
        exploring: "exploring";
    }>>>;
}, z.core.$strip>;
export declare const pregnancyLmpSchema: z.ZodObject<{
    lmpDate: z.ZodString;
}, z.core.$strip>;
export declare const cycleInfoSchema: z.ZodObject<{
    periodStartDate: z.ZodString;
    cycleLength: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    periodLength: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const emergencyContactSchema: z.ZodObject<{
    name: z.ZodString;
    phoneNumber: z.ZodString;
    relationship: z.ZodEnum<{
        Parent: "Parent";
        "Husband / Spouse": "Husband / Spouse";
        Partner: "Partner";
        "Family Member": "Family Member";
        Friend: "Friend";
        Other: "Other";
    }>;
}, z.core.$strip>;
export declare const emergencyContactParamSchema: z.ZodObject<{
    contactId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.validator.d.ts.map
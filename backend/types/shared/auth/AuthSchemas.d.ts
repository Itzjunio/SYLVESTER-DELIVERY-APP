import { z } from "zod";
export declare const authSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        customer: "customer";
        vendor: "vendor";
        rider: "rider";
    }>>;
}, z.core.$strip>;
export declare const forgetPasswordSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const resendVerificationCodeSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const verifyUserAccountSchema: z.ZodObject<{
    email: z.ZodEmail;
    validateCode: z.ZodNumber;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    email: z.ZodEmail;
    validateCode: z.ZodNumber;
    newPassword: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=AuthSchemas.d.ts.map
import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodEmail>;
    mobile: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=UserSchemas.d.ts.map
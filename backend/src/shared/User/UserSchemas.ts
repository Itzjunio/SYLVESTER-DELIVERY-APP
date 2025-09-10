import { z } from 'zod'

export const updateUserSchema = z.object({
    email: z.email().optional(),
    role: z.enum(['customer', 'vendor', 'rider']).optional(),
    mobile: z.string().optional(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
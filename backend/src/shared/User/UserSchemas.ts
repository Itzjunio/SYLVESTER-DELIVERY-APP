import { z } from 'zod'

export const updateUserSchema = z.object({
    email: z.email().optional(),
    mobile: z.string().optional(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
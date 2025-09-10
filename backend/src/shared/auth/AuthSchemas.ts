import { z } from "zod";

export const authSchema = z.object({
    email: z.email().min(5).max(60),
    password: z.string().min(6),
    role: z.enum(['customer', 'vendor', 'rider']).optional(),
});





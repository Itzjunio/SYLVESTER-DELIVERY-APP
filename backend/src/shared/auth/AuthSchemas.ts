import { z } from "zod";

export const authSchema = z.object({
  email: z.email().min(5).max(60),
  password: z.string().min(6),
  role: z.enum(["customer", "vendor", "rider", "admin"]).optional(),
});

export const forgetPasswordSchema = z.object({
  email: z.email().min(5).max(60),
});
export const resendVerificationCodeSchema = forgetPasswordSchema;

export const verifyUserAccountSchema = forgetPasswordSchema.extend({
  validateCode: z.number(),
});

export const resetPasswordSchema = verifyUserAccountSchema.extend({
  newPassword: z.string(),
});

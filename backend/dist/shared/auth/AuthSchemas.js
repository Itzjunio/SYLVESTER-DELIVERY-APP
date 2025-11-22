"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.verifyUserAccountSchema = exports.resendVerificationCodeSchema = exports.forgetPasswordSchema = exports.authSchema = void 0;
const zod_1 = require("zod");
exports.authSchema = zod_1.z.object({
    email: zod_1.z.email().min(5).max(60),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["customer", "vendor", "rider"]).optional(),
});
exports.forgetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email().min(5).max(60),
});
exports.resendVerificationCodeSchema = exports.forgetPasswordSchema;
exports.verifyUserAccountSchema = exports.forgetPasswordSchema.extend({
    validateCode: zod_1.z.number(),
});
exports.resetPasswordSchema = exports.verifyUserAccountSchema.extend({
    newPassword: zod_1.z.string(),
});
//# sourceMappingURL=AuthSchemas.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.email().optional(),
    mobile: zod_1.z.string().optional(),
});
//# sourceMappingURL=UserSchemas.js.map
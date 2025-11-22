"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDeviceTokenValidate = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.IDeviceTokenValidate = zod_1.z.object({
    userId: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    }),
    token: zod_1.z.string(),
    platform: zod_1.z.enum(["web", "ios", "android"]),
    role: zod_1.z.enum(["customer", "vendor", "rider"]),
    createdAt: zod_1.z
        .union([zod_1.z.string(), zod_1.z.date()])
        .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});
//# sourceMappingURL=fcmSchemas.js.map
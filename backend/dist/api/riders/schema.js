"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStausSchema = void 0;
const zod_1 = require("zod");
exports.orderStausSchema = zod_1.z.object({
    status: zod_1.z.enum(["in-transit", "delivered"]),
});
//# sourceMappingURL=schema.js.map
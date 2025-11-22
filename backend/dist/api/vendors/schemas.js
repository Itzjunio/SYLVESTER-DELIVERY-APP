"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectOrderSchema = exports.toggleActiveSchema = exports.toggleAvailabilitySchema = exports.updateItems = exports.addNewItems = exports.orderStausSchema = void 0;
const zod_1 = require("zod");
exports.orderStausSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "pending",
        "accepted",
        "in-transit",
        "delivered",
        "cancelled",
    ]),
});
exports.addNewItems = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    image: zod_1.z.string(),
    category: zod_1.z.string(),
    isAvailable: zod_1.z.boolean(),
});
exports.updateItems = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    image: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    isAvailable: zod_1.z.boolean().optional(),
});
exports.toggleAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean(),
});
exports.toggleActiveSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
exports.rejectOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().optional(),
});
//# sourceMappingURL=schemas.js.map
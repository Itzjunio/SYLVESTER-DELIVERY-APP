"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingSchema = exports.filterSchema = exports.placeOrderSchema = exports.getNearbyRestaurantsSchema = void 0;
const zod_1 = require("zod");
exports.getNearbyRestaurantsSchema = zod_1.z.object({
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    maxDistanceInMeters: zod_1.z.number().optional(),
});
exports.placeOrderSchema = zod_1.z.object({
    restaurantId: zod_1.z.string(),
    items: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        quantity: zod_1.z.number(),
    })),
    scheduled: zod_1.z.date(),
    paymentMethod: zod_1.z.string(),
});
exports.filterSchema = zod_1.z.object({
    cuisine: zod_1.z.string().optional(),
    minRating: zod_1.z.coerce.number().min(0).max(5).optional(),
    maxDeliveryTime: zod_1.z.coerce.number().min(1).optional(),
});
exports.ratingSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, "orderId is required"),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().max(500).optional(),
});
//# sourceMappingURL=schemas.js.map
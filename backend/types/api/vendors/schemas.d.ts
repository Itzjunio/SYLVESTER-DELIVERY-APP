import { z } from "zod";
export declare const orderStausSchema: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        accepted: "accepted";
        "in-transit": "in-transit";
        delivered: "delivered";
        cancelled: "cancelled";
    }>;
}, z.core.$strip>;
export declare const addNewItems: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    image: z.ZodString;
    category: z.ZodString;
    isAvailable: z.ZodBoolean;
}, z.core.$strip>;
export declare const updateItems: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    image: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const toggleAvailabilitySchema: z.ZodObject<{
    isAvailable: z.ZodBoolean;
}, z.core.$strip>;
export declare const toggleActiveSchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, z.core.$strip>;
export declare const rejectOrderSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map
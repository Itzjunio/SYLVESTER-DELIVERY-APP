import { z } from "zod";
export declare const getNearbyRestaurantsSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    maxDistanceInMeters: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const placeOrderSchema: z.ZodObject<{
    restaurantId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
    scheduled: z.ZodDate;
    paymentMethod: z.ZodString;
}, z.core.$strip>;
export declare const filterSchema: z.ZodObject<{
    cuisine: z.ZodOptional<z.ZodString>;
    minRating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxDeliveryTime: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const ratingSchema: z.ZodObject<{
    orderId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map
import { z } from "zod";

export const getNearbyRestaurantsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  maxDistanceInMeters: z.number().optional(),
});

export const placeOrderSchema = z.object({
  restaurantId: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),
  scheduled: z.date(),
  paymentMethod: z.string(),
});

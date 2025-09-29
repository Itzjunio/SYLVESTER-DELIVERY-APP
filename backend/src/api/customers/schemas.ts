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

export const filterSchema = z.object({
  cuisine: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxDeliveryTime: z.coerce.number().min(1).optional(),
});

export const ratingSchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});
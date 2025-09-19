import { boolean, z } from "zod";

export const orderStausSchema = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "in-transit",
    "delivered",
    "cancelled",
  ]),
});

export const addNewItems = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  category: z.string(),
  isAvailable: z.boolean(),
});
export const updateItems = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export const toggleAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const toggleActiveSchema = z.object({
  isActive: z.boolean(),
});

export const rejectOrderSchema = z.object({
  reason: z.string().optional(),
});

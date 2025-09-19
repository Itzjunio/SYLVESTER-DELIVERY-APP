import { z } from "zod";

export const orderStausSchema = z.object({
  status: z.enum(["in-transit", "delivered"]),
});

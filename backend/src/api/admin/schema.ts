import { z } from 'zod'

export const riderPerformanceSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  riderId: z.string().optional(),
});
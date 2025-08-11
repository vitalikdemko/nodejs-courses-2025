import { z } from 'zod';

export const BrewDTO = z.object({
  beans: z.string().min(3).max(40),
  method: z.enum(['v60', 'aeropress', 'chemex', 'espresso']),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(200).optional(),
  brewedAt: z.string().datetime().optional()
});
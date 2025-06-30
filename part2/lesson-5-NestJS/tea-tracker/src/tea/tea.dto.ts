import { z } from 'zod';

export const TeaSchema = z.object({
  name: z.string().min(3).max(40),
  origin: z.string().min(2).max(30),
  rating: z.number().int().min(1).max(10).optional(),
  brewTemp: z.number().min(60).max(100).optional(),
  notes: z.string().max(150).optional(),
});

export type CreateTeaDto = z.infer<typeof TeaSchema>;

export type UpdateTeaDto = Partial<CreateTeaDto>;

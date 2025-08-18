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

export const TeaListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  minRating: z.coerce.number().int().min(1).max(10).optional(),
});

export type TeaListQuery = z.infer<typeof TeaListQuerySchema>;

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
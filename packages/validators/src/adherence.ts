import { z } from 'zod';

export const submitAdherenceSchema = z.object({
  drugId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  takenAt: z.string().datetime(),
  videoId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type SubmitAdherenceInput = z.infer<typeof submitAdherenceSchema>;

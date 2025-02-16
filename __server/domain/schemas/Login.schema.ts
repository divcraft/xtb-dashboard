import { z } from 'zod';

export const LoginResponseSchema = z.object({
  status: z.boolean(),
  streamSessionId: z.string(),
});

export type LoginResponseType = z.infer<typeof LoginResponseSchema>;

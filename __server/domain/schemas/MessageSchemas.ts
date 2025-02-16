import { z } from 'zod';

// ✅ Define Trade Record Schema
export const TradeSchema = z.object({
  close_price: z.number(),
  close_time: z.number().nullable(),
  closed: z.boolean(),
  cmd: z.number(),
  comment: z.string(),
  profit: z.number(),
  symbol: z.string().nullable(),
  volume: z.number(),
});

// ✅ Define Trades Response Schema
export const TradesResponseSchema = z.object({
  status: z.boolean(),
  returnData: z.array(TradeSchema),
});

// ✅ Define Login Response Schema
export const LoginResponseSchema = z.object({
  status: z.boolean(),
  streamSessionId: z.string(),
});

// ✅ Add a Mapping to Guess Message Type
export const MESSAGE_SCHEMAS = {
  trades: TradesResponseSchema,
  login: LoginResponseSchema,
};

export type TradeRecord = z.infer<typeof TradeSchema>;
export type TradesResponse = z.infer<typeof TradesResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type MessageType = keyof typeof MESSAGE_SCHEMAS;
export type MessageData = TradesResponse | LoginResponse;

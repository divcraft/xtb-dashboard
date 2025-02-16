import { z } from 'zod';

export const TradeSchema = z.object({
  close_price: z.number(),
  close_time: z.number().nullable(),
  close_timeString: z.string().nullable(),
  closed: z.boolean(),
  cmd: z.number(),
  comment: z.string(),
  commission: z.number().nullable(),
  customComment: z.string().nullable(),
  digits: z.number(),
  expiration: z.number().nullable(),
  expirationString: z.string().nullable(),
  margin_rate: z.number(),
  offset: z.number(),
  open_price: z.number(),
  open_time: z.number(),
  open_timeString: z.string(),
  order: z.number(),
  order2: z.number(),
  position: z.number(),
  profit: z.number(),
  sl: z.number(),
  storage: z.number(),
  symbol: z.string().nullable(),
  timestamp: z.number(),
  tp: z.number(),
  volume: z.number(),
  nominalValue: z.number().nullable(),
  spread: z.number().nullable(),
  taxes: z.number().nullable(),
});

export const TradesResponseSchema = z.object({
  status: z.boolean(),
  returnData: z.array(TradeSchema),
});

export type TradeType = z.infer<typeof TradeSchema>;
export type TradesResponseType = z.infer<typeof TradesResponseSchema>;

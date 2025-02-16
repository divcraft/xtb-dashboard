import { LoginResponseSchema, type LoginResponseType } from '../../domain/schemas/Login.schema';
import { SymbolResponseSchema, type SymbolResponseType } from '../../domain/schemas/Symbol.schema';
import { TradesResponseSchema, type TradesResponseType } from '../../domain/schemas/Trades.schema';

type ClassifyMessageType =
  | {
      type: 'login';
      data: LoginResponseType;
    }
  | {
      type: 'trades';
      data: TradesResponseType;
    }
  | {
      type: 'symbol';
      data: SymbolResponseType;
    }
  | null;

export function classifyMessage(message: unknown): ClassifyMessageType {
  if (typeof message !== 'object' || message === null) return null;

  if (LoginResponseSchema.safeParse(message).success) {
    return {
      type: 'login',
      data: LoginResponseSchema.safeParse(message).data!,
    };
  }

  if (TradesResponseSchema.safeParse(message).success) {
    return {
      type: 'trades',
      data: TradesResponseSchema.safeParse(message).data!,
    };
  }

  if (SymbolResponseSchema.safeParse(message).success) {
    return {
      type: 'symbol',
      data: SymbolResponseSchema.safeParse(message).data!,
    };
  }

  console.error(`Parsing error: No schema fits the message - ${JSON.stringify(message, null, 2)}`);

  return null;
}

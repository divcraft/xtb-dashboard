import {
  MESSAGE_SCHEMAS,
  type LoginResponse,
  type TradesResponse,
} from '../../domain/schemas/MessageSchemas';

type ClassifyMessageType =
  | {
      type: 'login';
      data: LoginResponse;
    }
  | {
      type: 'trades';
      data: TradesResponse;
    }
  | null;

export function classifyMessage(message: unknown): ClassifyMessageType {
  if (typeof message !== 'object' || message === null) return null;

  if (MESSAGE_SCHEMAS.login.safeParse(message).success) {
    return {
      type: 'login',
      data: MESSAGE_SCHEMAS.login.safeParse(message).data!,
    };
  }

  if (MESSAGE_SCHEMAS.trades.safeParse(message).success) {
    return {
      type: 'trades',
      data: MESSAGE_SCHEMAS.trades.safeParse(message).data!,
    };
  }

  return null;
}

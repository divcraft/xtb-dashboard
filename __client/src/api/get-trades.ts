import type { TradeAppResponse } from '../../../__server/domain/models/Trade.model';

export const getTrades = async (): Promise<Array<TradeAppResponse>> => {
  const response = await fetch('http://localhost:4040/trades');
  if (response.ok) {
    const data: Array<TradeAppResponse> = await response.json();
    return data;
  } else {
    throw Error('Cannot fetch trades');
  }
};

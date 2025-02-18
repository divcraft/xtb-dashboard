import type { TradeAppResponse } from '../../../__server/domain/models/Trade.model';
import { writable, type Writable } from 'svelte/store';
import { getTrades } from '../api/get-trades';

export const tradesStore: Writable<Array<TradeAppResponse>> = writable([]);
const data = await getTrades();
tradesStore.set(data);

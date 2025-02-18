import Decimal from 'decimal.js';
import type { TradeType } from '../schemas/Trades.schema';
import type { SymbolModel } from './Symbol.model';

export interface TradeAppResponse {
  name: string;
  group: string;
  currency: string;
  volume: number;
  openTransaction: number;
  closeTransaction: number | null;
  openPrice: number;
  closePrice: number;
  profit: number;
  taxes: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string | null;
}

export class TradeModel {
  private readonly trade: TradeType;
  public symbol: SymbolModel | null;

  public constructor(trade: TradeType) {
    this.trade = trade;
    this.symbol = null;
  }

  public get id(): number {
    return this.trade.order;
  }

  private get name(): string | null {
    return this.symbol?.name ?? null;
  }

  private get group(): string | null {
    return this.symbol?.group ?? null;
  }

  private get currency(): string | null {
    return this.symbol?.currency ?? null;
  }

  private get profit(): Decimal {
    return new Decimal(this.trade.profit);
  }

  private get openPrice(): Decimal {
    return new Decimal(this.trade.open_price);
  }

  private get closePrice(): Decimal {
    return new Decimal(this.trade.close_price);
  }

  private get openTime(): string {
    return this.trade.open_timeString;
  }

  private get closeTime(): string | null {
    return this.trade.close_timeString;
  }

  private get volume(): Decimal {
    return new Decimal(this.trade.volume);
  }

  private get openTransaction(): Decimal {
    return this.openPrice.times(this.volume);
  }

  private get closeTransaction(): Decimal {
    return this.closePrice.times(this.volume);
  }

  private get taxes(): Decimal {
    return new Decimal(this.trade.taxes ?? 0);
  }

  private get isOpen(): boolean {
    return this.trade.closed === false;
  }

  public updateSymbol = (symbol: SymbolModel | null): void => {
    this.symbol = symbol;
  };

  public get symbolKey(): string | null {
    return this.trade.symbol;
  }

  public toResponse = (): TradeAppResponse => {
    return {
      name: this.name ?? '',
      group: this.group ?? '',
      currency: this.currency ?? '',
      volume: this.volume.toNumber(),
      profit: this.profit.toNumber(),
      openTransaction: this.openTransaction.toNumber(),
      closeTransaction: this.closeTransaction.toNumber(),
      openPrice: this.openPrice.toNumber(),
      closePrice: this.openPrice.toNumber(),
      taxes: this.taxes.toNumber(),
      isOpen: this.isOpen,
      openTime: this.openTime,
      closeTime: this.closeTime,
    };
  };
}

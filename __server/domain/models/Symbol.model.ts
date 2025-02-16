import type { SymbolType } from '../schemas/Symbol.schema';

export class SymbolModel {
  private readonly symbol: SymbolType;
  public constructor(symbol: SymbolType) {
    this.symbol = symbol;
  }

  public get key(): string {
    return this.symbol.symbol;
  }

  public get name(): string {
    return this.symbol.description;
  }

  public get group(): string {
    return this.symbol.groupName;
  }

  public get currency(): string {
    return this.symbol.currency;
  }
}

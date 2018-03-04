
import Decimal from 'decimal.js';
import { SideOfTrade } from './side-of-trade';

export class MarketPair {
  public selling: string;
  public buying: string;

  public quote: string;
  public base: string;

  public baseMinSize: Decimal;
  public baseMaxSize: Decimal;
  public quoteIncrement: Decimal;
  public precision: number;

  public pair: string;

  public currencyForSide(side: SideOfTrade): string {
    if (side === SideOfTrade.BUY) {
      return this.buying;
    }

    return this.selling;
  }

  public currencyForOtherSide(side: SideOfTrade): string {
    if (side === SideOfTrade.BUY) {
      return this.selling;
    }

    return this.buying;
  }

  public equals(other: MarketPair): boolean {
    return (this.pair === other.pair);
  }

  public toString(): string {
    return this.pair;
  }
}

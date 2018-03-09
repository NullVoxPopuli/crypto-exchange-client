import Decimal from 'decimal.js';

export interface Ticker {
  symbol: string;
  timestamp: number;

  open24h: Decimal;
  low24h: Decimal;
  high24h: Decimal;
  volume24h: Decimal;

  highestBid: Decimal;
  lowestAsk: Decimal;

  lastTradePrice: Decimal;
}

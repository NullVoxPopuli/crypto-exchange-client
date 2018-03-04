import Decimal from 'decimal.js';
import { MarketPair } from './market-pair';
import { SideOfTrade } from './side-of-trade';

export enum OrderStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  NEW = 'new',
  QUEUED = 'queued',
  PARTIALLY_FILLED = 'partially-filled',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  LIMIT = 'limit',
  MARKET = 'market',
  STOP = 'stop',
  STOP_LIMIT = 'stop-limit',
  TRAILING_STOP = 'trailing-stop',
  FILL_OR_KILL = 'fill-or-kill',
}

export class Order {
  public id: string;
  public status: OrderStatus;
  public symbol: string;
  public marketPair: MarketPair;
  public side: SideOfTrade;
  public type: OrderType;
  public price: Decimal;
  public size: Decimal;
  public filled: Decimal;
  public remaining: Decimal;
  public timestamp: Date;
}

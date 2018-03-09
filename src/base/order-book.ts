import { OrderBookEntry } from './messages/order-book-entry';

export interface OrderBook {
  sequence: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

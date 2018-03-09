import { CobinhoodOrderBook } from '../messages';

import { OrderBook } from 'base/order-book';
import { COUNT, PRICE, SIZE } from '../messages/order-book-update';

export function transformOrderBook(data: CobinhoodOrderBook): OrderBook {
  const { sequence, bids, asks } = data;

  return {
    sequence,
    bids: bids.map(b => ({
      price: b[PRICE],
      size: b[SIZE],
      count: b[COUNT],
    })),
    asks: asks.map(a => ({
      price: a[PRICE],
      size: a[SIZE],
      count: a[COUNT],
    })),
  };
}

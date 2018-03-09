import { OrderBook } from 'base/order-book';
import { CobinhoodOrderBook } from '../messages';
import { transformOrderBook } from '../transforms';

export function extractOrderBook(data: CobinhoodOrderBook): OrderBook {
  return transformOrderBook(data);
}

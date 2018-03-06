
import Decimal from 'decimal.js';
import * as _ from 'lodash';

import { lPad } from 'utils';
import { OrderBookEntry } from './messages/order-book-entry';
import { SideOfTrade } from './side-of-trade';

export interface OrderBook {
  [price: string]: Decimal;
}

const zero = new Decimal(0);
const small = new Decimal(0.0000001);

const isPresent = (value: Decimal, _price: string) => (
  value !== undefined &&
  value !== null &&
  value.greaterThan(small)
);

const MAX_ORDER_BOOK_DISPLAY_SIZE = 10;

export class MarketPair {
  public selling: string;
  public buying: string;

  public quote: string;
  public base: string;

  public baseMinSize: Decimal;
  public baseMaxSize: Decimal;
  public quoteIncrement: Decimal;
  public precision: number;

  public asks: OrderBook;
  public bids: OrderBook;

  public pair: string;

  constructor() {
    this.asks = {};
    this.bids = {};
  }

  public updateOrderBook(bids: OrderBookEntry[], asks: OrderBookEntry[], isSnapshot: boolean) {
    asks.forEach((ask: OrderBookEntry) => {
      const { price, count } = ask;
      const oldCount = this.asks[ask.price];

      const newValue = new Decimal(count || 0);
      const value = isSnapshot ? newValue : (oldCount || zero).plus(newValue);

      this.asks[ask.price] = value;
    });

    bids.forEach((bid: OrderBookEntry) => {
      const { price, count } = bid;
      const oldCount = this.bids[bid.price];

      const newValue = new Decimal(count || 0);
      const value = isSnapshot ? newValue : (oldCount || zero).plus(newValue);

      this.bids[bid.price] = newValue;
    });

  }

  public lowestAskVolume(): Decimal {
    const price = this.lowestAskPrice();

    return this.asks[price];
  }

  public lowestAskPrice(): string {
    return this.sortAsks(this.asks)[0];
  }

  public highestBidPrice(): string {
    return this.sortBids(this.bids)[0];
  }

  public highestBidVolume(): Decimal {
    const price = this.highestBidPrice();

    return this.bids[price];
  }

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

  public print(): void {
    const asks = this.sortAsks(this.asks);
    const bids = this.sortBids(this.bids);

    console.log(`
      ------------
      ${this.pair}

        Amount           Price
    `);

    asks.slice(0, MAX_ORDER_BOOK_DISPLAY_SIZE).reverse().forEach(price => {
      const volume = lPad(this.asks[price]);
      console.log(`${volume} ${this.base}    @ ${lPad(price)} ${this.quote}`);
    });

    console.log(`\n   -- ▲ asks ▲    -   ▼ bids ▼ --\n`);
    bids.slice(0, MAX_ORDER_BOOK_DISPLAY_SIZE).forEach(price => {
      const volume = lPad(this.bids[price]);
      console.log(`${volume} ${this.base}    @ ${lPad(price)} ${this.quote}`);
    });
  }

  private sortBids(bids: OrderBook): string[] {
    const outstandingBids = _.pickBy(bids, isPresent);
    const prices = Object.keys(outstandingBids);

    // sort is ascending, reverse puts the biggest at top
    const sorted = _.sortBy(prices, Number);

    return sorted.reverse();
  }

  private sortAsks(asks: OrderBook): string[] {
    const outstandingAsks = _.pickBy(asks, isPresent);
    const prices = Object.keys(outstandingAsks);

    // sort is ascending, the smallest at the top
    const sorted = _.sortBy(prices, Number);

    return sorted;
  }
}

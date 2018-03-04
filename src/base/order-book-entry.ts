export interface OrderBookEntry {
  price: number;
  size: number;
  count: number;
}

export interface OrderBookDelta {

    channelId: any;
    symbol: string;

    highestBid: number;
    lowestAsk: number;

    sizeAtHighestBid: number;
    sizeAtLowestAsk: number;

    bids: OrderBookEntry[];
    asks: OrderBookEntry[];

    // informational data
    info: any; // raw update
}

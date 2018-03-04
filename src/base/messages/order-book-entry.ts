export interface OrderBookEntry {
  price: number;
  size: number;
  count: number;
}

export interface OrderBookUpdateSummary {

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

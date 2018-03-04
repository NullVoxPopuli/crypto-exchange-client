export interface OrderBookEntry {
  price: string;
  size: string;
  count: string;
}

export interface OrderBookUpdateSummary {

    channelId: any;
    symbol: string;

    highestBid: number;
    lowestAsk: number;

    isSnapshot: boolean;

    sizeAtHighestBid: number;
    sizeAtLowestAsk: number;

    bids: OrderBookEntry[];
    asks: OrderBookEntry[];

    // informational data
    info: any; // raw update
}

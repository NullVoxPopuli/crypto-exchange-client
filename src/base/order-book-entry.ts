export interface OrderBookEntry {

    channelId: any;
    symbol: string;

    highestBid: number;
    lowestAsk: number;

    sizeAtHighestBid: number;
    sizeAtLowestAsk: number;

    // informational data
    info: any; // raw update
}

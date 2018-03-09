export interface TickerUpdate {
  // websocket
  channelType?: string;
  channelId?: string;

  // what we actually care about
  lowestAsk: number;
  highestBid: number;
  price: string;
  symbol: string;

  // not all exchanges provide this
  sizeOfLastSell?: string;
  sizeOfLastBuy?: string;

  // informational data
  timestamp?: number;
  datetime?: Date;
  info: any; // raw ticker
}

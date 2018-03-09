import { TickerUpdate } from '~/base';

  // The Ticker Channel
  //   {
  //     "type": "ticker",
  //     "trade_id": 20153558,
  //     "sequence": 3262786978,
  //     "time": "2017-09-02T17:05:49.250000Z",
  //     "product_id": "BTC-USD",
  //     "price": "4388.01000000",
  //     "side": "buy", // Taker side
  //     "last_size": "0.03000000",
  //     "best_bid": "4388",
  //     "best_ask": "4388.01"
  // }
export default class GDAXTickerUpdate implements TickerUpdate {
  // from Ticker
  public info: any;
  public channelId?: string | undefined;
  public channelType?: string | undefined;

  public symbol: string;
  public price: string;

  public lowestAsk: number;
  public highestBid: number;

  public sizeOfLastBuy: string;
  public sizeOfLastSell: string;

  public timestamp?: number | undefined;
  public datetime?: Date;

  // additional fields provided by gdax
  // -none

  constructor(json: any) {
    this.info = json;

    this.symbol = json.product_id;

    this.price = json.price;

    this.lowestAsk = parseFloat(json.best_ask);
    this.highestBid = parseFloat(json.best_bid);

    if (json.side === 'buy') {
      this.sizeOfLastBuy = json.last_size;
    }

    if (json.side === 'sell') {
      this.sizeOfLastSell = json.last_size;
    }

    this.datetime = new Date('2017-09-02T17:05:49.250000Z');
    this.timestamp = this.datetime.getTime();
  }
}

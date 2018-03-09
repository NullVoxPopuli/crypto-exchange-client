import { TickerUpdate as BaseTickerUpdate } from '~/base';

const LAST_TRADE_ID = 0;
const PRICE = 1;
const HIGHEST_BID = 2;
const LOWEST_ASK = 3;
const VOLUME_24H = 4;
const HIGH_24H = 5;
const LOW_24H = 6;
const OPEN_24H = 7;
const TIME_STAMP = 8;

export default class TickerUpdate implements BaseTickerUpdate {
  // from Ticker
  public info: any;
  public channelId: any;
  public channelType: any;
  public symbol: any;
  public price: any;
  public highestBid: number;
  public lowestAsk: number;
  public timestamp: any;
  public datetime: Date;

  // additional fields provided by cobinhood
  public open24h: string;
  public low24h: string;
  public high24h: string;
  public volume24h: string;
  public lastTradeId: string;

  constructor(json: any) {
    this.info = json;

    const data = json.update || json.snapshot;

    this.channelId = json.channel_id;

    const channelParts = this.channelId.split('.');
    this.channelType = channelParts[0];
    this.symbol = channelParts[1];

    this.lastTradeId = data[LAST_TRADE_ID];
    this.price       = data[PRICE];
    this.highestBid  = parseFloat(data[HIGHEST_BID]);
    this.lowestAsk   = parseFloat(data[LOWEST_ASK]);
    this.volume24h   = data[VOLUME_24H];
    this.high24h     = data[HIGH_24H];
    this.low24h      = data[LOW_24H];
    this.open24h     = data[OPEN_24H];
    this.timestamp   = data[TIME_STAMP];
  }
}

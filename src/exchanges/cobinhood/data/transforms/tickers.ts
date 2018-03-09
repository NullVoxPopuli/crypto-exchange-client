import Decimal from 'decimal.js';

import { Ticker } from '~/base';
import { CobinhoodTicker } from '../messages';

export function transformTicker(data: CobinhoodTicker): Ticker {
  return {
    symbol: data.trading_pair_id,
    timestamp: data.timestamp,

    open24h: new Decimal(data['24h_open']),
    low24h: new Decimal(data['24h_low']),
    high24h: new Decimal(data['24h_high']),
    volume24h: new Decimal(data['24h_volume']),

    highestBid: new Decimal(data.highest_bid),
    lowestAsk: new Decimal(data.lowest_ask),

    lastTradePrice: new Decimal(data.last_trade_price),
  };
}

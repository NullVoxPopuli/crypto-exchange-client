import Decimal from 'decimal.js';

export interface CobinhoodTicker {
  ['trading_pair_id']: string;
  ['timestamp']: number;

  ['24h_high']: Decimal;
  ['24h_low']: Decimal;
  ['24h_open']: Decimal;
  ['24h_volume']: Decimal;

  ['last_trade_price']: Decimal;
  ['highest_bid']: Decimal;
  ['lowest_ask']: Decimal;
}

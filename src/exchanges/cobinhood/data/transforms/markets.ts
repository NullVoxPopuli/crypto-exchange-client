import Decimal from 'decimal.js';
import { MarketPair } from '~/base';

export function transformMarket(json: any): MarketPair {
    const {
        id,
        base_max_size, base_min_size,
        base_currency_id, quote_currency_id,
        quote_increment,
    } = json;

    const marketPair = new MarketPair();

    marketPair.pair = id;

    // TRX-ETH
    // - TRX: Base
    // - ETH: Quote
    marketPair.base = base_currency_id;
    marketPair.quote = quote_currency_id;

    // Sell ETH to Buy TRX
    marketPair.buying = base_currency_id;
    marketPair.selling = quote_currency_id;

    marketPair.baseMaxSize = new Decimal(base_max_size);
    marketPair.baseMinSize = new Decimal(base_min_size);
    marketPair.quoteIncrement = new Decimal(quote_increment);
    marketPair.precision = quote_increment.split('.')[1].length;

    return marketPair;
}

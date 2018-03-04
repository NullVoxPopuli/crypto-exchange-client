import { MarketPair } from '~/base';
import Decimal from 'decimal.js';

export function transformMarket(json: any): MarketPair {
    const {
        id,
        base_max_size, base_min_size,
        base_currency, quote_currency,
        quote_increment,
    } = json;

    const marketPair = new MarketPair();

    marketPair.pair = id;

    // TRX-ETH
    // - TRX: Base
    // - ETH: Quote
    marketPair.base = base_currency;
    marketPair.quote = quote_currency;

    // Sell ETH to Buy TRX
    marketPair.buying = base_currency;
    marketPair.selling = quote_currency;

    marketPair.baseMaxSize = new Decimal(base_max_size);
    marketPair.baseMinSize = new Decimal(base_min_size);
    marketPair.quoteIncrement = new Decimal(quote_increment);

    return marketPair;
}

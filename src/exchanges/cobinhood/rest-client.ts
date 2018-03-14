import Decimal from 'decimal.js';
import fetch from 'node-fetch';

import {
  AbstractRestClient, AssetBalances, Currency, MarketPair, Order, OrderBook, RequestError,
  RestClient, Ticker, TickerUpdate,
} from '~/base';
import {
  extractBalances,
  extractCurrencies,
  extractMarkets, extractOpenOrders, extractOrder,
  extractOrderBook,
  extractOrders,
  extractTicker,
} from './data/extractions';
import CobinhoodFeed from './websocket-client';

const CLOUDFLARE_NONCE_OFFSET = 150;

export default class CobinhoodRestClient extends AbstractRestClient implements RestClient {
    public static baseUrl = 'https://api.cobinhood.com/v1/';
    public SocketClient = CobinhoodFeed;

    public marketPairsBySymbol: { [symbol: string]: MarketPair } = {};

    public async getSystemTime(): Promise<number> {
      const before = new Date().getTime();
      const response = await this.get('system/time');
      const after = new Date().getTime();

      console.log(`getting system time took ${after - before}ms`);

      return parseInt(response.result.time, 10);
    }

    public async getCurrencies(): Promise<Currency[]> {
      const response = await this.get('market/currencies');

      return extractCurrencies(response.result.currencies);
    }

    public async createLimitOrder(market: string, amount: string, price: string, isBuySide: boolean): Promise<Order> {
      return this.createOrder(market, amount, price, 'limit', isBuySide);
    }

    public async createOrder(
      market: string, amount: string, price: string,
      type: string, isBuySide: boolean): Promise<Order> {
      const payload = {
        ['trading_pair_id']: market,
        // bid: willing to buy the quote at the max price (buys)
        // ask: asking for someone to pay me for my offer (sells)
        ['side']: isBuySide ? 'bid' : 'ask',
        ['type']: type,
        // quote price - quote/base == how many quotes make up a base
        ['price']: price,
        ['size']: amount,
      };

      const response = await this.post('trading/orders', payload);

      return extractOrder(response.result.order);
    }

    public async getOrder(id: string): Promise<Order> {
      const response = await this.get(`trading/orders/${id}`);

      return extractOrder(response.result.order);
    }

    public async cancelOrder(id: string) {
      return await this.destroy(`trading/orders/${id}`);
    }

    public async getMarkets(): Promise<MarketPair[]> {
        const response = await this.get('market/trading_pairs');
        const markets = extractMarkets(response.result.trading_pairs);

        this.populateMarketPairCache(markets);

        return markets;
    }

    public async getOrderBook(market: string, limit = 50): Promise<OrderBook> {
      const response = await this.get(`market/orderbooks/${market}?limit=${limit}`);

      return extractOrderBook(response.result.orderbook);
    }

    public async getMarketStats() {
      const response = await this.get('market/stats');

      return response.result;
    }

    public async getTicker(market: string): Promise<Ticker> {
      const response = await this.get(`market/tickers/${market}`);

      return extractTicker(response.result.ticker);
    }

    public async getBalances(): Promise<AssetBalances> {
        const response = await this.get('wallet/balances');

        return extractBalances(response.result.balances);
    }

    public async getOpenOrders(): Promise<Order[]> {
        const response = await this.get('trading/orders');

        return extractOpenOrders(response.result.orders);
    }

    public async getOrders(): Promise<Order[]> {
        const response = await this.get('trading/orders');

        return extractOrders(response.result.orders);
    }

    /***************************************************
     *  Helpers Functions
     **************************************************/

    public async makeRequest(path: string, options: any, retries = 0): Promise<any> {
        const url = `${CobinhoodRestClient.baseUrl}${path}`;

        const key = process.env.COBINHOOD_API_KEY || '';

        this.assertCredentials({ COBINHOOD_API_KEY: key });

        const fetchOptions = {
            headers: {
                ['authorization']: key || '',
                ['nonce']: new Date().getTime() + CLOUDFLARE_NONCE_OFFSET,
            },
            ...options,
        };

        const requestStart = new Date().getTime();
        const result = await fetch(url, fetchOptions).then((response: any) => response.json());
        console.log(`${options.method} ${path}: ${(new Date().getTime()) - requestStart} ms`);

        // since cloudflare is somewhat unreliable with realtime data
        // retry in case of failure (specifically invalid_nonce)
        // this won't be needed once orders can be submitted
        // over websocket
        if (result.error && result.error.error_code === 'invalid_nonce' && retries <= 2) {
          return this.makeRequest(path, options, retries + 1);
        }

        if (result.error) {
          throw new RequestError(result.error);
        }

        return result;
    }

}

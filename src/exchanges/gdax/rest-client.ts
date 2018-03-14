import * as crypto from 'crypto';
import Decimal from 'decimal.js';
import fetch from 'node-fetch';

import { AbstractRestClient, AssetBalances, MarketPair, Order, RestClient } from '~/base';
import { extractBalances, extractMarkets } from './data/extractions';

import GDaxFeed from './websocket-client';

const MS_IN_S = 1000;

export default class GDAXRestClient extends AbstractRestClient implements RestClient {
  public static baseUrl = 'https://api.gdax.com';
  public SOCKET_CLIENT = GDaxFeed;

  public async createLimitOrder(_market: string, _amount: string, _price: string, _isBuySide: boolean): Promise<Order> {
    throw new Error('Not Implemented');
  }

  public async getMarkets(): Promise<MarketPair[]> {
    const response = await this.get('/products');
    const markets = extractMarkets(response);

    this.populateMarketPairCache(markets);

    return markets;
  }

  public async getBalances(): Promise<AssetBalances> {
    const response = await this.get('/accounts');

    return extractBalances(response);
  }

    /***************************************************
     *  Helpers Functions
     **************************************************/

    public async makeRequest(path: string, options: any) {
      const url = `${GDAXRestClient.baseUrl}${path}`;

      const key = process.env.GDAX_API_KEY || '';
      const passphrase = process.env.GDAX_PASSPHRASE || '';
      const secret = process.env.GDAX_SECRET || '';

      this.assertCredentials({
        GDAX_API_KEY: key,
        GDAX_PASSPHRASE: passphrase,
        GDAX_SECRET: secret,
      });

      const timestamp = Date.now() / MS_IN_S;
      const signature = this.createSignature(
        secret, timestamp, path,
        options.body, options.method,
      );

      const fetchOptions = {
          headers: {
              ['CB-ACCESS-KEY']: key,
              ['CB-ACCESS-SIGN']: signature,
              ['CB-ACCESS-TIMESTAMP']: timestamp,
              ['CB-ACCESS-PASSPHRASE']: passphrase,
          },
          ...options,
      };

      const requestStart = new Date().getTime();
      const result = await fetch(url, fetchOptions).then((response: any) => response.json());
      console.log(`${options.method} ${path}: ${(new Date().getTime()) - requestStart} ms`);

      return result;
  }

  private createSignature(secret: string, timestamp: number, path: string, body: any, method: string) {
    const stringBody = body && JSON.stringify(body) || '';

    // create the prehash string by concatenating required parts
    const what = timestamp + method + path + stringBody;

    // decode the base64 secret
    const key = new Buffer(secret, 'base64');

    // create a sha256 hmac with the secret
    const hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac
    // and finally base64 encode the result
    return hmac.update(what).digest('base64');
  }
}

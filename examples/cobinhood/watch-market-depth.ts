import Decimal from 'decimal.js';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import {
  AbstractRestClient, AbstractWebSocketClient, AssetBalances, MarketPair,
  OrderBookUpdateSummary,
} from '~/base';

import { CobinhoodFeed, CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

Decimal.set({ precision: 8 }); // one more than max on exchange

async function begin() {
  const client = new CobinhoodRestClient();
  const socket = new client.SocketClient();

  const markets = await client.getMarkets();
  const balances = await client.getBalances();

  await listen(socket, balances, client);
}

async function listen(socket: AbstractWebSocketClient, balances: AssetBalances, client: AbstractRestClient) {
  const markets = _.values(client.marketPairsBySymbol);
  const currencies = Object.keys(balances);

  socket.onOpen(handleOpen(socket));

  socket.onReceiveOrderBookUpdate(handleReceivedOrderBookUpdate(client));

  socket.connect();
}

const handleOpen = (socket: AbstractWebSocketClient) => () => {
  const symbol = 'ETH-BTC';
  const precision = 7;

  socket.subscribeTo('order-book', { trading_pair_id: symbol, precision: `1E-${precision}` });
};

const handleReceivedOrderBookUpdate = (client: AbstractRestClient) => (data: OrderBookUpdateSummary) => {
  const { bids, asks, symbol, isSnapshot } = data;
  const market = client.marketForSymbol(symbol);

  market.updateOrderBook(bids, asks, isSnapshot);

  market.print();

};

begin();

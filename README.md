# Typescript Crypto API Clients w/ WebSockets

Similar to ccxt, this project aims to provide a common interface for interacting with exchange apis. The difference is that this projcet provides a common websocket interface, is implemented in only a single language, and enforces types (so that different implementations can be uniform, and not cause errors when switching between exchanges)

Cobinhood is the only completed implementation, but this project is setup to allow for any number of implementations.

## Installation

Coming soon

## Cobinhood Usage

[API Documentation](https://cobinhood.github.io/api-public/)

### Authentication
In the root of your project folder, create a `.env` file

```
COBINHOOD_API_KEY="your-cobinhood-api-key"
```

this will be loaded on boot of your application, and will throw an exception if `process.env.COBINHOOD_API_KEY` is an empty value when trying to access an authenticated endpoint (meaning, you don't _need_ an `.env` file, but it's handy for development).

### Examples
See `./examples/cobinhood`  
run with

```bash
yarn example ./examples/cobinhood/watch-market-depth.ts
```

### Creating Clients
```ts
import { CobinhoodRestClient, CobinhoodFeed } from 'crypto-exchange-client';

const client = new CobinhoodRestClient();
const socket = new client.SocketClient();
// or, specifically:
const socket = new CobinhoodFeed();
```

### Using the WebSocket Client
```ts
socket.onOpen(handleOpen(socket));

socket.onReceiveTicker(handleReceivedTicker);
socket.onReceiveOrderBookUpdate(handleReceivedOrderBookUpdate);

socket.onSubscribe(handleSubscribe);
socket.connect();

const handleOpen = (socket) => () => {
  socket.subscribeTo('ticker', { trading_pair_id: 'ETH-BTC' });
};

// do something with ticker data
const handleReceivedTicker = (data: Ticker) => {};

// do something with order book data
const handleReceivedOrderBookUpdate = (data: OrderBookUpdateSummary) => {};

// json here is a subscription response, which mostly contains
// the subscription request data
const handleSubscribe = (json: any) => {}
```

### REST Client Overview
```ts
// getting all your balances
const balances = await client.getBalances();

// buying
const order = await client.createLimitBuyOrder('ETH-BTC', '2', '0.098');

```

### Full Cobinhood Documentation
<!-- start cobinhood rest --><details><summary>Cobinhood Rest Client</summary><p>

## Cobinhood Rest Client

Given that you have a CobinhoodRestClient,
```ts
const client = new CobinhoodRestClient();
```

The following mirrors the [cobinhood api documentation](https://cobinhood.github.io/api-public)

<!-- start markets --> <details><summary>Markets</summary><p style="margin-left: 5px;"">

### Markets

None of the market apis require auth.

```ts
client.getCurrencies()
client.getMarkets()
client.getOrderBook(market: string, limit = 50)
client.getMarketStats()
client.getTicker();
client.getRecentTrades(market: string);
```

#### Interacting with the market data:

```ts
// { [symbol: string]: MarketPair }
client.marketPairsBySymbol
```

All market data from the api requests are stored on an object of type `MarketPair`.

Note that if a list of currency symbols is needed, but a separate request is not desired, that can be done with `Object.keys` on the `client.marketPairsBySymbol` data, and splitting on the separator, `-`.
```ts
const currencies = _.uniq(_.flatten(
    Object.keys(marketPairsBySymbol).map(symbol => symbol.split('-'))
))
```

#### Getting Cached Market

```ts
client.marketForSymbol('ETH-BTC');
```

<hr />
</p></details> <!-- end markets -->


<!-- start orders --> <details style='margin-right: 5px;'><summary>Orders</summary><p>

### Orders

All of these apis require auth
```ts
client.getOrder(id: string);
client.getOpenOrders();

client.createOrder(market: string, amount: string, price: string, type: string, isBuySide: boolean);
// shorthands for createOrder
client.createLimitOrder(market: string, amount: string, price: string, isBuySide: boolean);
client.createLimitBuyOrder(market: string, amount: string, price: string);
client.createLimitSellOrder(market: string, amount: string, price: string);

client.createMarketBuyOrder(market: string, amount: string);
client.createMarketSellOrder(market: string, amount: string);
client.createMarketOrder(market: string, amount: string, isBuySide: boolean);


client.cancelOrder(id: string);
```

<hr />
</p></details> <!-- end orders -->

<hr />
</p></details> <!-- end cobinhood rest -->


<details><summary>Cobinhood Web Socket Client</summary>


<h4>Cobinhood Web Socket Client</h4>

```ts
const socket = new CobinhoodFeed();
```
</details>



### Support

Programming takes time, so if there is no time to submit a PR or a bugfix, donations are welcome at:

ETH (or any ERC20 that Cobinhood supports):  
0xF6C2769a30647f6B7a412E446cD56650fAC64205  

BTC:   
1MfGcwcUPHADTumrxCponqv7eAxfZMyha8

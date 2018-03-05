# Typescript Crypto API Clients w/ WebSockets

Similar to ccxt, this project aims to provide a common interface for interacting with exchange apis. The difference is that this projcet provides a common websocket interface, is implemented in only a single language, and enforces types (so that different implementations can be uniform, and not cause errors when switching between exchanges)

Cobinhood is the only completed implementation, but this project is setup to allow for any number of implementations.

## Cobinhood Usage

[API Documentation](https://cobinhood.github.io/api-public/)

### Authentication
In the root of your project folder, create a `.env` file

```
COBINHOOD_API_KEY="your-cobinhood-api-key"
```

this will be loaded on boot of your application, and will throw an exception if `process.env.COBINHOOD_API_KEY` is an empty value when trying to access an authenticated endpoint (meaning, you don't _need_ an `.env` file, but it's handy for development).

### Example App
See `./examples/cobinhood`  
run with

```bash
yarn example ./examples/cobinhood
```

### Creating Clients
```ts
import { CobinhoodRestClient, CobinhoodFeed } from 'crypto-exchange-client';

const client = new CobinhoodRestClient();
const socket = new client.SOCKET_CLIENT();
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
const handleReceivedOrderBookUpdate = (data: OrderBookEntry) => {};

// json here is a subscription response, which mostly contains
// the subscription request data
const handleSubscribe = (json: any) => {}
```

### Using the REST Client
```ts
// getting all your balances
const balances = await client.getBalances();

// buying
const order = await client.createLimitBuyOrder('ETH-BTC', 2, '0.098');
// selling
const order = await client.createLimitSellOrder('ETH-BTC', 2, '0.098');

```

### Full Cobinhood Documentation
<!-- start cobinhood rest --><details><summary>Cobinhood Rest Client</summary>

## Cobinhood Rest Client

<!-- start markets --> <details style='margin-right: 5px;'><summary>Markets</summary>

## Markets


</details> <!-- end markets -->

<!-- start orders --> <details style='margin-right: 5px;'><summary>Orders</summary>

## Orders


</details> <!-- end orders -->

</details> <!-- end cobinhood rest -->


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

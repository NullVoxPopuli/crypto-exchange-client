import { CobinhoodRestClient } from '~/index';

async function begin() {
  const client = new CobinhoodRestClient();

  const order = await client.createMarketBuyOrder('ETH-BTC', '2');

  console.log(order);
}

begin();

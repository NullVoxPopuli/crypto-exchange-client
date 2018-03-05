import { CobinhoodRestClient } from '~/index';

async function begin() {
  const client = new CobinhoodRestClient();

  const order = await client.createLimitBuyOrder('ETH-BTC', '2', '0.7');

  console.log(order);
}

begin();

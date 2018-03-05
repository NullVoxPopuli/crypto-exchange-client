import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const order = await client.createMarketBuyOrder('ETH-BTC', '2');

  console.log(order);
}

begin();

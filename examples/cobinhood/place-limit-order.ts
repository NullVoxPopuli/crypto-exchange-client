import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const order = await client.createLimitBuyOrder('ETH-BTC', '2', '0.7');

  console.log(order);
}

begin();

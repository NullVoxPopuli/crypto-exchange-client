import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const result = await client.getOrderBook('ETH-BTC');

  console.log(result);
}

begin();

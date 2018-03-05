import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const orders = await client.getOpenOrders();

  console.log(orders);
}

begin();

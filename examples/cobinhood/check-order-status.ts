import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const orders = await client.getOpenOrders();

  console.log(orders);

  const order = await client.getOrder('7444b1fd-f9a2-4249-949c-d77a2e355d40');

  console.log(order);
}

begin();

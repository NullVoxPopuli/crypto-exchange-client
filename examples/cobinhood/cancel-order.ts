import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  await client.cancelOrder('37f550a202aa6a3fe120f420637c894c');

  console.log('success');
}

begin();

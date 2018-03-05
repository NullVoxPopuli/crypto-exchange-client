import { CobinhoodRestClient } from '~/index';

async function begin() {
  const client = new CobinhoodRestClient();

  const ticker = await client.getTicker('ETH-BTC');

  console.log(ticker);
}

begin();

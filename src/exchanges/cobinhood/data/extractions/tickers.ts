import { Ticker } from '~/base';
import { CobinhoodTicker } from '../messages';
import { transformTicker } from '../transforms';

export function extractTicker(data: CobinhoodTicker): Ticker {
  return transformTicker(data);
}

import { MarketPair } from '~/base';
import { transformMarket } from '../transforms';

export function extractMarkets(data: any[]): MarketPair[] {
    return data.map(transformMarket);
}

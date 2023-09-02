import { ExtractBiddingItemsEntity } from '../../domain/entities';
import { ExtractBiddingItemsParams } from '../../domain/usecases';

export interface ExtractBiddingItemsRepository {
  extractItems: (
    extractParams: ExtractBiddingItemsParams,
  ) => Promise<ExtractBiddingItemsEntity[]>;
}

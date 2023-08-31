import { ExtractBiddingEntity } from '../../domain/entities';
import { ExtractBiddingParams } from '../../domain/usecases';

export interface ExtractBiddingRepository {
  extract: (
    extractParams: ExtractBiddingParams,
  ) => Promise<ExtractBiddingEntity[]>;
}

import { ExtractBiddingEntity } from '../../domain/entities';
// import { ExtractBiddingParams } from '../../domain/usecases';

export interface ExtractBiddingRepository {
  extract: (url: string) => Promise<ExtractBiddingEntity[]>;
}

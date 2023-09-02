import {
  ExtractBiddingParams,
  ExtractBiddingUsecase,
} from '../../domain/usecases';
import { ExtractBiddingRepository } from '../contracts';
import { ExtractBiddingEntity } from '../../domain/entities';

export class ExtractBidding implements ExtractBiddingUsecase {
  private readonly extractBiddingRepository: ExtractBiddingRepository;

  constructor(extractBiddingRepository: ExtractBiddingRepository) {
    this.extractBiddingRepository = extractBiddingRepository;
  }

  async extract(
    extractParams: ExtractBiddingParams,
  ): Promise<ExtractBiddingEntity[]> {
    const allBids: ExtractBiddingEntity[] =
      await this.extractBiddingRepository.extract(extractParams);
    return allBids;
  }
}

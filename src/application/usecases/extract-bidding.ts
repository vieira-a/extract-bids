import { ExtractBiddingUsecase } from '../../domain/usecases';
import { ExtractBiddingRepository } from '../contracts';
import { ExtractBiddingEntity } from '../../domain/entities';

export class ExtractBidding implements ExtractBiddingUsecase {
  private readonly extractBiddingRepository: ExtractBiddingRepository;

  constructor(extractBiddingRepository: ExtractBiddingRepository) {
    this.extractBiddingRepository = extractBiddingRepository;
  }

  async extract(url: string): Promise<ExtractBiddingEntity[]> {
    const allBids = await this.extractBiddingRepository.extract(url);
    return allBids;
  }
}

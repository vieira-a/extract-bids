import {
  ExtractBiddingItemsParams,
  ExtractBiddingItemsUsecase,
} from 'src/domain/usecases';
import { ExtractBiddingItemsRepository } from '../contracts';
import { ExtractBiddingItemsEntity } from '../../domain/entities';

export class ExtractBiddingItems implements ExtractBiddingItemsUsecase {
  private readonly extractBiddingItemsRepository: ExtractBiddingItemsRepository;

  constructor(extractBiddingItemsRepository: ExtractBiddingItemsRepository) {
    this.extractBiddingItemsRepository = extractBiddingItemsRepository;
  }

  async extractItems(
    extractParams: ExtractBiddingItemsParams,
  ): Promise<ExtractBiddingItemsEntity[]> {
    const allItems: ExtractBiddingItemsEntity[] =
      await this.extractBiddingItemsRepository.extractItems(extractParams);
    return allItems;
  }
}

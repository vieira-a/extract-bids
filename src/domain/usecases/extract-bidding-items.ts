import { ExtractBiddingItemsEntity } from '../entities';

export type ExtractBiddingItemsParams = {
  url: string;
  code: string;
};

export interface ExtractBiddingItemsUsecase {
  extractItems: (
    extractParams: ExtractBiddingItemsParams,
  ) => Promise<ExtractBiddingItemsEntity[]>;
}

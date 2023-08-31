import { ExtractBiddingEntity, BiddingItems } from '../../domain/entities';

export interface ExtractBiddingApiResponse {
  result: ExtractBiddingEntity[];
}

export interface ExtractBiddingItemsApiResponse {
  itens: ExtractBiddingResult;
}

export interface ExtractBiddingResult {
  result: BiddingItems[];
}

import { ExtractBiddingItemsEntity } from '../../domain/entities';

export interface ExtractBiddingItemsApiResponse {
  itens?: ExtractBiddingItemsResult;
  lotes?: ExtractBiddingLotesResult;
  isLote?: boolean;
}

export interface ExtractBiddingItemsResult {
  result?: ExtractBiddingItemsEntity[];
}

export interface ExtractBiddingLotesResult {
  result?: ExtractBiddingLotesItens;
}

export interface ExtractBiddingLotesItens {
  length: number;
  itens?: ExtractBiddingItemsEntity[];
}

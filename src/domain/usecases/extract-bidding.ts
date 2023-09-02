import { ExtractBiddingEntity } from '../entities';

export type ExtractBiddingParams = {
  url?: string;
  schedule?: number;
  interval?: number;
  typeDate?: number;
  initialDate?: string;
  finalDate?: string;
};

export interface ExtractBiddingUsecase {
  extract: (url: string) => Promise<ExtractBiddingEntity[]>;
}

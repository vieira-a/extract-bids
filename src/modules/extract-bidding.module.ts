import { Module } from '@nestjs/common';
import {
  ExtractBiddingApiRepository,
  ExtractBiddingItemsApiRepository,
} from '../infra/extraction-data';

@Module({
  providers: [ExtractBiddingApiRepository, ExtractBiddingItemsApiRepository],
})
export class ExtractBiddingModule {}

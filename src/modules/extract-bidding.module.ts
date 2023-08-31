import { Module } from '@nestjs/common';
import { ExtractBiddingApiRepository } from '../infra/extraction-data/extract-bidding-api.repository';

@Module({
  providers: [ExtractBiddingApiRepository],
})
export class ExtractBiddingModule {}

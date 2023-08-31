import { Module } from '@nestjs/common';
import { ExtractBiddingModule } from './modules/extract-bidding.module';

@Module({
  imports: [ExtractBiddingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

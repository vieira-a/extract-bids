import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtractBiddingModule } from './modules/extract-bidding.module';
import { MongoDbConfigService } from './config/mongodb-config.service';

@Module({
  imports: [ConfigModule.forRoot(), ExtractBiddingModule],
  controllers: [],
  providers: [MongoDbConfigService],
})
export class AppModule {}

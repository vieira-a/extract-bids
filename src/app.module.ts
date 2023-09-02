import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtractBiddingModule } from './modules/extract-bidding.module';
import { MongoDbConfigService } from './config/mongodb-config.service';
import { ExtractController } from './presentation/controllers/extract-processes.controller';
import { ExtractRunnerService } from './application/services/extract-runner';
import { MongoDbHelper } from './infra/db/mongodb/mongodb-helper';
import { ExtractBidding } from './application/usecases';
import { ExtractBiddingApiRepository } from './infra/extraction-data';

@Module({
  imports: [ConfigModule.forRoot(), ExtractBiddingModule],
  controllers: [ExtractController],
  providers: [
    ExtractBiddingApiRepository,
    MongoDbHelper,
    ExtractBidding,
    ExtractRunnerService,
    MongoDbConfigService,
  ],
})
export class AppModule {}

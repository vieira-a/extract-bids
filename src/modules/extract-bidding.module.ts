import { Module } from '@nestjs/common';
import { ExtractController } from '../presentation/controllers/extract-processes.controller';
import { ExtractRunnerService } from '../application/services/extract-runner';
import { MongoDbHelper } from '../infra/db/mongodb/mongodb-helper';
import { MongoDbConfigService } from '../config/mongodb-config.service';
import { ExtractBidding } from '../application/usecases';
import {
  ExtractBiddingApiRepository,
  ExtractBiddingItemsApiRepository,
} from '../infra/extraction-data';

@Module({
  controllers: [ExtractController],
  providers: [
    MongoDbConfigService,
    ExtractBidding,
    MongoDbHelper,
    ExtractRunnerService,
    ExtractBiddingApiRepository,
    ExtractBiddingItemsApiRepository,
  ],
})
export class ExtractBiddingModule {}

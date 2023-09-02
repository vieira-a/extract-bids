import { Module } from '@nestjs/common';
import {
  ExtractController,
  ExtractItemsController,
} from '../presentation/controllers';
import {
  ExtractRunnerService,
  ExtractRunnerItemsService,
} from '../application/services';
import { MongoDbHelper } from '../infra/db/mongodb/mongodb-helper';
import { MongoDbConfigService } from '../config/mongodb-config.service';
import { ExtractBidding, ExtractBiddingItems } from '../application/usecases';
import {
  ExtractBiddingApiRepository,
  ExtractBiddingItemsApiRepository,
} from '../infra/extraction-data';

@Module({
  controllers: [ExtractController, ExtractItemsController],
  providers: [
    ExtractRunnerItemsService,
    ExtractBiddingItems,
    MongoDbConfigService,
    ExtractBidding,
    MongoDbHelper,
    ExtractRunnerService,
    ExtractBiddingApiRepository,
    ExtractBiddingItemsApiRepository,
  ],
})
export class ExtractBiddingModule {}

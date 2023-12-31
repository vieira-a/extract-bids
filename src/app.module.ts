import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ExtractBiddingModule } from './modules/extract-bidding.module';
import { MongoDbConfigService } from './config/mongodb-config.service';
import {
  ExtractController,
  ExtractItemsController,
  ProcessesController,
} from './presentation/controllers';
import {
  ExtractRunnerService,
  ExtractRunnerItemsService,
} from './application/services';
import { MongoDbHelper } from './infra/db/mongodb/mongodb-helper';
import { ExtractBidding, ExtractBiddingItems } from './application/usecases';
import {
  ExtractBiddingApiRepository,
  ExtractBiddingItemsApiRepository,
} from './infra/extraction-data';
import { ExtractSchedule } from './config/extract-schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    ExtractBiddingModule,
  ],
  controllers: [ExtractController, ExtractItemsController, ProcessesController],
  providers: [
    ExtractBiddingItemsApiRepository,
    ExtractRunnerItemsService,
    ExtractBiddingItems,
    ExtractBiddingApiRepository,
    MongoDbHelper,
    ExtractBidding,
    ExtractRunnerService,
    MongoDbConfigService,
    ExtractSchedule,
  ],
})
export class AppModule {}

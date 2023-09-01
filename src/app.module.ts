import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtractBiddingModule } from './modules/extract-bidding.module';
// import { MongoDbModule } from './modules/mongodb-helper.module';
import { MongoDbServiceModule } from './modules/mongodb-service.module';

@Module({
  imports: [
    ExtractBiddingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongoDbModule,
    MongoDbServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

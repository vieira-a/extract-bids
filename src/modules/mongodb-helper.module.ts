import { Module } from '@nestjs/common';
import { MongoDbHelper } from '../infra/db/mongodb/mongodb-helper';

@Module({
  providers: [MongoDbHelper],
  exports: [MongoDbHelper],
})
export class MongoDbModule {}

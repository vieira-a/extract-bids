import { ExtractRunnerService } from './extract-runner';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { ExtractBiddingApiRepository } from '../../infra/extraction-data/extract-bidding-api.repository';
import { ExtractBidding } from '../usecases/extract-bidding';
import { ConfigService } from '@nestjs/config';

async function runExtraction() {
  const configService = new ConfigService();
  const mongoDbHelper = new MongoDbHelper(configService);
  const extractBiddingApiRepository = new ExtractBiddingApiRepository();
  const extractBidding = new ExtractBidding(extractBiddingApiRepository);

  const extractRunnerService = new ExtractRunnerService(
    mongoDbHelper,
    extractBiddingApiRepository,
    extractBidding,
  );
  await extractRunnerService.extractRunner();
}

runExtraction();

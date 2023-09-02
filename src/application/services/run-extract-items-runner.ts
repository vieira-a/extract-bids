import { MongoDbConfigService } from '../../config/mongodb-config.service';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { ExtractBiddingItemsApiRepository } from '../../infra/extraction-data';
import { ExtractBiddingItems } from '../usecases';
import { ExtractRunnerItemsService } from './extract-items-runner';

async function runExtractionItems() {
  const mongoDbConfigService = new MongoDbConfigService();
  const mongoDbHelper = new MongoDbHelper(mongoDbConfigService);
  const extractBiddingItemsApiRepository =
    new ExtractBiddingItemsApiRepository();
  const extractBiddingItems = new ExtractBiddingItems(
    extractBiddingItemsApiRepository,
  );

  await mongoDbConfigService.onApplicationBootstrap();

  const extractRunnerItemsService = new ExtractRunnerItemsService(
    mongoDbHelper,
    extractBiddingItemsApiRepository,
    extractBiddingItems,
  );
  try {
    await extractRunnerItemsService.extractProcessesItems();
  } catch (error) {
    console.error('Erro ao executar extração:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runExtractionItems();

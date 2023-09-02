import { MongoDbConfigService } from '../../config/mongodb-config.service';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { ExtractBiddingItemsApiRepository } from '../../infra/extraction-data';
import { ExtractBiddingItems } from '../usecases';
import { ExtractRunnerItemsService } from './extract-items-runner';

export async function runExtractionItems(): Promise<any> {
  const mongoDbConfigService = new MongoDbConfigService();
  const mongoDbHelper = new MongoDbHelper(mongoDbConfigService);
  const extractBiddingItemsApiRepository = new ExtractBiddingItemsApiRepository(
    mongoDbHelper,
  );
  const extractBiddingItems = new ExtractBiddingItems(
    extractBiddingItemsApiRepository,
  );

  const extractRunnerItemsService = new ExtractRunnerItemsService(
    mongoDbHelper,
    extractBiddingItems,
  );

  await mongoDbConfigService.onApplicationBootstrap();
  console.log('Iniciando extração de itens...');

  try {
    console.log(
      'Executando extractRunnerItemsService.extractProcessesItems...',
    );
    await extractRunnerItemsService.extractProcessesItems();
    console.log('Extração concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao executar extração:', error);
    throw error;
    //process.exit(1);
  }
}

if (require.main === module) {
  runExtractionItems();
}

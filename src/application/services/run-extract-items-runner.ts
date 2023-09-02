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

  try {
    if (await mongoDbHelper.isExtractionAlreadyInProgress()) {
      console.log('Já existe uma extração de itens de processos em andamento');
    } else {
      await mongoDbHelper.lockExtraction();
      console.log('Iniciando extração de itens de processos');
    }
    await extractRunnerItemsService.extractProcessesItems();
    await mongoDbHelper.unLockExtraction();
    console.log('Extração concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao executar extração:', error);
    throw error;
  }
}

if (require.main === module) {
  runExtractionItems();
  console.log('Rodando extração manual de itens de processos');
}

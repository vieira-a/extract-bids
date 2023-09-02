import { MongoDbConfigService } from '../../config/mongodb-config.service';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { ExtractBiddingApiRepository } from '../../infra/extraction-data';
import { ExtractBidding } from '../usecases';
import { ExtractRunnerService } from './extract-runner';

export async function runExtraction() {
  const mongoDbConfigService = new MongoDbConfigService();
  const mongoDbHelper = new MongoDbHelper(mongoDbConfigService);
  const extractBiddingApiRepository = new ExtractBiddingApiRepository(
    mongoDbHelper,
  );
  const extractBidding = new ExtractBidding(extractBiddingApiRepository);

  await mongoDbConfigService.onApplicationBootstrap();

  const extractRunnerService = new ExtractRunnerService(
    extractBidding,
    mongoDbHelper,
  );
  try {
    if (await mongoDbHelper.isExtractionAlreadyInProgress()) {
      console.log('Já existe uma extração de processos em andamento');
    } else {
      await mongoDbHelper.lockExtraction();
      console.log('Iniciando extração de processos');
    }
    await extractRunnerService.extractProcesses();
    await mongoDbHelper.unLockExtraction();
    console.log('Extração de processos concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao executar extração:', error);
    throw error;
  }
}

if (require.main === module) {
  runExtraction();
  console.log('Rodando extração manual de processos');
}

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

  const extractRunnerService = new ExtractRunnerService(extractBidding);
  try {
    await extractRunnerService.extractProcesses();
  } catch (error) {
    console.error('Erro ao executar extração:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  runExtraction();
  console.log('Rodando extração manual de processos');
}

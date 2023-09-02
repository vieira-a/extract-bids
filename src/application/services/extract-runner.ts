import { ExtractBidding } from '../usecases';
import { Injectable } from '@nestjs/common';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';

@Injectable()
export class ExtractRunnerService {
  constructor(
    private readonly extractBidding: ExtractBidding,
    private readonly mongoDbHelper: MongoDbHelper,
  ) {}

  async extractProcesses(): Promise<void> {
    const today = new Date();
    const dataInterval = new Date();
    dataInterval.setDate(today.getDate() + 2);
    let page = 1;
    let url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}&pagina=${page}`;

    if (await this.mongoDbHelper.isExtractionAlreadyInProgress()) {
      console.log('Já existe uma extração de processos em andamento');
    } else {
      await this.mongoDbHelper.lockExtraction();
      console.log('Iniciando extração processos');
    }

    while (true) {
      const extractedDataBids = await this.extractBidding.extract(url);
      if (extractedDataBids && extractedDataBids.length > 0) {
        page++;

        url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=2023-08-31T03:00:00.000Z&dataFinal=2023-08-31T03:00:00.000Z&pagina=${page}`;
      } else {
        await this.mongoDbHelper.unLockExtraction();
        console.log('***Finalizada extração de processos');
        return;
      }
    }
  }
}

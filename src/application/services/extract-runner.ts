import { ExtractBiddingParams } from '../../domain/usecases';
import { ExtractBidding } from '../usecases';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractRunnerService {
  constructor(
    private readonly mongoDbHelper: MongoDbHelper,
    private readonly extractBidding: ExtractBidding,
  ) {}

  async extractProcesses(): Promise<void> {
    console.log('***Iniciada extração de processos');
    const today = new Date();
    const dataInterval = new Date();
    dataInterval.setDate(today.getDate() + 2);
    let page = 1;

    const extractParams: ExtractBiddingParams = {
      url: `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}&pagina=1`,
      schedule: 0,
      interval: 30,
    };

    while (true) {
      console.log('URL', extractParams);
      const extractedDataBids =
        await this.extractBidding.extract(extractParams);

      console.log('Dados', extractedDataBids);

      if (extractedDataBids.length === 0) {
        console.log('***Finalizada extração de processos');
        return;
      }

      for (const bidding of extractedDataBids) {
        await this.mongoDbHelper.saveExtractedBidding(bidding);
      }

      page++;

      extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=2023-08-31T03:00:00.000Z&dataFinal=2023-08-31T03:00:00.000Z&pagina=${page}`;
    }
  }
}

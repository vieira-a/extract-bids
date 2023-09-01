import { ExtractBiddingParams } from '../../domain/usecases';
import { ExtractBidding } from '../usecases/extract-bidding';
import { ExtractBiddingApiRepository } from '../../infra/extraction-data/extract-bidding-api.repository';
// import fetch from 'node-fetch';
// import { extractBiddingItemMapper } from '../../infra/util/extract-bidding-item-mapper';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractRunnerService {
  constructor(
    private readonly mongoDbHelper: MongoDbHelper,
    private readonly extractBiddingApiRepository: ExtractBiddingApiRepository,
    private readonly extractBidding: ExtractBidding,
  ) {}

  async extractRunner() {
    console.log('***Iniciando extração');
    const today = new Date();
    const dataInterval = new Date();
    dataInterval.setDate(today.getDate() + 1);
    let page = 1;
    // const allCodes = new Set();

    const extractParams: ExtractBiddingParams = {
      url: `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}&pagina=1`,
      schedule: 0,
      interval: 30,
    };

    while (true) {
      const extractedDataBids =
        await this.extractBidding.extract(extractParams);

      if (extractedDataBids.length === 0) {
        console.log('*** Processo de extração concluído');
        return;
      }

      extractedDataBids.map(async (bidding) => {
        await this.mongoDbHelper.saveExtractedBidding('processes', bidding);
      });

      // const codes = extractedDataBids.map((item) => item.codigoLicitacao);

      // let urlItems = '';
      // for (const code of codes) {
      //   urlItems = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${code}/itens?`;
      //   const response = await fetch(urlItems);
      //   const extractedBidsItems = await response.json();
      //   const extractedBidsAllItems = extractBiddingItemMapper(
      //     extractedBidsItems,
      //     code,
      //   );
      //   console.log(extractedBidsAllItems);
      // }

      page++;

      extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=2023-08-31T03:00:00.000Z&dataFinal=2023-08-31T03:00:00.000Z&pagina=${page}`;
    }

    // const allBidsCodes = Array.from(allCodes);
    // return allBidsCodes;
  }
}

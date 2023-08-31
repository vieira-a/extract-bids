import { ExtractBiddingParams } from '../../domain/usecases';
import { ExtractBidding } from '../usecases/extract-bidding';
import { ExtractBiddingApiRepository } from '../../infra/extraction-data/extract-bidding-api.repository';
// import fetch from 'node-fetch';
// import { extractBiddingItemMapper } from '../../infra/util/extract-bidding-item-mapper';

async function extractRunner() {
  const extractBiddingApiRepository = new ExtractBiddingApiRepository();
  const extractBidding = new ExtractBidding(extractBiddingApiRepository);

  const today = new Date();
  const dataInterval = new Date();
  dataInterval.setDate(today.getDate() + 1);
  let page = 1;
  const allCodes = new Set();

  const extractParams: ExtractBiddingParams = {
    url: `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}&pagina=1`,
    schedule: 0,
    interval: 30,
  };

  while (true) {
    const extractedDataBids = await extractBidding.extract(extractParams);

    if (extractedDataBids.length === 0) {
      break;
    }

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

  const allBidsCodes = Array.from(allCodes);
  return allBidsCodes;
}

extractRunner();

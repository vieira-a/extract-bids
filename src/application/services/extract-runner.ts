import { ExtractBidding } from '../usecases';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractRunnerService {
  constructor(private readonly extractBidding: ExtractBidding) {}

  async extractProcesses(): Promise<void> {
    const today = new Date();
    const dataInterval = new Date();
    dataInterval.setDate(today.getDate() + 2);
    let page = 1;
    let url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}&pagina=${page}`;

    while (true) {
      const extractedDataBids = await this.extractBidding.extract(url);
      if (extractedDataBids && extractedDataBids.length > 0) {
        page++;

        url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=2023-08-31T03:00:00.000Z&dataFinal=2023-08-31T03:00:00.000Z&pagina=${page}`;
      } else {
        console.log('***Finalizada extração de processos');
        return;
      }
    }
  }
}

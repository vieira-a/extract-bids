import { Controller, Get } from '@nestjs/common';
import { ExtractBiddingApiRepository } from '../../infra/extraction-data';

@Controller('extract')
export class ExtractController {
  constructor(
    private readonly extractBiddingApiRepository: ExtractBiddingApiRepository,
  ) {}

  @Get()
  async extractProcesses(): Promise<any> {
    const today = new Date();
    const dataInterval = new Date();
    dataInterval.setDate(today.getDate() + 2);
    let page = 1;
    const baseUrl = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?tens?filtro=&tipoData=1&dataInicial=${today.toISOString()}&dataFinal=${dataInterval.toISOString()}`;

    try {
      console.log('***Controller: Iniciando extração de processos...');
      const allExtractedDataBids = [];

      while (true) {
        console.log(`***CONTROLLER: Buscando página ${page}...`);
        const url = `${baseUrl}&pagina=${page}`;
        const extractedDataBids =
          await this.extractBiddingApiRepository.extract(url);

        if (extractedDataBids.length === 0) {
          console.log('Extração de processos concluída com sucesso.');
          break;
        }

        allExtractedDataBids.push(...extractedDataBids);
        page++;
      }

      return { message: 'Extração concluída com sucesso' };
    } catch (error) {
      console.error('Erro durante a extração de processos:', error);
      return { error: 'Erro durante a extração de processos' };
    }
  }
}

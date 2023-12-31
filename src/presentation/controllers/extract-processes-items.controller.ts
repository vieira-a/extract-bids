import { Controller, Get } from '@nestjs/common';
import { ExtractRunnerItemsService } from '../../application/services/extract-items-runner';
import { ExtractBiddingItemsApiRepository } from 'src/infra/extraction-data';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { ExtractBiddingItemsParams } from '../../domain/usecases';

@Controller('extract/items')
export class ExtractItemsController {
  constructor(
    private readonly extractRunnerItemsService: ExtractRunnerItemsService,
    private readonly extractBiddingItemsApiRepository: ExtractBiddingItemsApiRepository,
    private readonly mongoDbHelper: MongoDbHelper,
  ) {}

  @Get()
  async extractProcessesItems(): Promise<any> {
    const extractParams: ExtractBiddingItemsParams = {
      url: '',
      code: '',
    };
    try {
      if (await this.mongoDbHelper.isExtractionAlreadyInProgress()) {
        console.log(
          '*** Controller: Já existe uma extração de itens de processos em andamento',
        );
        return {
          message: 'Já existe uma extração de itens de processos em andamento',
        };
      } else {
        await this.mongoDbHelper.lockExtraction();
        console.log('***Controller: Iniciando extração de itens de processos');
      }
      const allProcessCodes = await this.mongoDbHelper.getAllProcessCodes();

      for (const code of allProcessCodes) {
        extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${code}/itens?`;
        extractParams.code = code;
        const extractedProcessItems =
          this.extractBiddingItemsApiRepository.extractItems(extractParams);
        for (const processItem of await extractedProcessItems) {
          await this.mongoDbHelper.saveProcessItems(processItem);
          console.log('***Controller: extrando itens do processo', processItem);
        }
      }
      await this.mongoDbHelper.unLockExtraction();
      return {
        message: 'Extração de itens de processos concluída com sucesso',
      };
    } catch (error) {
      console.error('Erro durante a extração de itens do processo');
      return { error: 'Erro durante a extração de itens de processos' };
    }
  }
}

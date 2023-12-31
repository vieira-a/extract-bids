import { ExtractBiddingItemsParams } from '../../domain/usecases';
import { ExtractBiddingItems } from '../usecases';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractRunnerItemsService {
  constructor(
    private readonly mongoDbHelper: MongoDbHelper,
    private readonly extractBiddingItems: ExtractBiddingItems,
  ) {}

  async extractProcessesItems(): Promise<any> {
    const extractParams: ExtractBiddingItemsParams = {
      url: '',
      code: '',
    };
    console.log(
      '***Extração de Items: iniciada a extração de itens de processos',
    );
    try {
      if (await this.mongoDbHelper.isExtractionAlreadyInProgress()) {
        console.log(
          'Já existe uma extração de itens de processos em andamento',
        );
      } else {
        await this.mongoDbHelper.lockExtraction();
        console.log('Iniciando extração de itens de processos');
      }
      const allProcessCodes = await this.mongoDbHelper.getAllProcessCodes();
      console.log('***Extrator: códigos', allProcessCodes);

      for (const code of allProcessCodes) {
        extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${code}/itens?`;
        extractParams.code = code;

        const extractedProcessItems =
          await this.extractBiddingItems.extractItems(extractParams);

        for (const processItem of extractedProcessItems) {
          await this.mongoDbHelper.saveProcessItems(processItem);
        }
      }
      await this.mongoDbHelper.unLockExtraction();
      console.log(
        '***Extração de Items: finalizada a extração de itens de processos',
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

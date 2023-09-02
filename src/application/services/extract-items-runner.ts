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

  async extractProcessesItems(): Promise<void> {
    const extractParams: ExtractBiddingItemsParams = {
      url: '',
      code: '',
    };
    console.log(
      '***Extração de Items: iniciada a extração de itens de processos',
    );
    try {
      const allProcessCodes = await this.mongoDbHelper.getAllProcessCodes();

      for (const code of allProcessCodes) {
        extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${code}/itens?`;
        extractParams.code = code;

        const extractedProcessItems =
          await this.extractBiddingItems.extractItems(extractParams);

        for (const processItem of extractedProcessItems) {
          await this.mongoDbHelper.saveProcessItems(processItem);
        }
      }
      console.log(
        '***Extração de Items: finalizada a extração de itens de processos',
      );
    } catch (error) {
      console.log(error);
    }
  }
}

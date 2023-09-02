import { ExtractBiddingItemsParams } from '../../domain/usecases';
import { ExtractBiddingItems } from '../usecases';
import { ExtractBiddingItemsApiRepository } from '../../infra/extraction-data';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractRunnerItemsService {
  constructor(
    private readonly mongoDbHelper: MongoDbHelper,
    private readonly extractBiddingItemsApiRepository: ExtractBiddingItemsApiRepository,
    private readonly extractBiddingItems: ExtractBiddingItems,
  ) {}

  async extractProcessesItems(): Promise<void> {
    const extractParams: ExtractBiddingItemsParams = {
      url: '',
      code: '',
    };
    console.log(
      '***Extração de Items: iniciada extração de itens de processos',
    );
    try {
      const allProcessCodes = await this.mongoDbHelper.getAllProcessCodes();
      // console.log(
      //   '***Extração de Items: códigos dos processos obtidos',
      //   allProcessCodes,
      // );

      for (const code of allProcessCodes) {
        extractParams.url = `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${code}/itens?`;
        extractParams.code = code;

        const extractedProcessItems =
          await this.extractBiddingItems.extractItems(extractParams);

        for (const processItem of extractedProcessItems) {
          console.log(processItem);
          //await this.mongoDbHelper.saveProcessItems(processItem);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

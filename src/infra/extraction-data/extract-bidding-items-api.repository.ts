import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

import { ExtractBiddingItemsRepository } from '../../application/contracts';
import { ExtractBiddingItemsEntity } from '../../domain/entities';
import { ExtractBiddingItemsParams } from '../../domain/usecases';
import { extractBiddingItemMapper } from '../util';
import { MongoDbHelper } from '../db/mongodb/mongodb-helper';

@Injectable()
export class ExtractBiddingItemsApiRepository
  implements ExtractBiddingItemsRepository
{
  constructor(private readonly mongoDbHelper: MongoDbHelper) {}

  async extractItems(
    extractParams: ExtractBiddingItemsParams,
  ): Promise<ExtractBiddingItemsEntity[]> {
    const { url, code } = extractParams;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao acessar a API de itens das licitações');
      }

      const extractedBidsItems = await response.json();

      const biddingItemsDocument = extractBiddingItemMapper(
        extractedBidsItems,
        code,
      );

      // console.log('*** Repository', biddingItemsDocument);

      for (const biddingItem of biddingItemsDocument) {
        await this.mongoDbHelper.saveProcessItems(biddingItem);
        console.log(
          `*** MongoDB: itens do processo ${biddingItem.codigoLicitacao} salvos com sucesso`,
        );
      }

      return biddingItemsDocument;
    } catch (error) {
      console.error('Erro durante a extração e salvamento de dados:', error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

import { ExtractBiddingRepository } from '../../application/contracts';
import { ExtractBiddingEntity } from '../../domain/entities';
import { extractBiddingMapper } from '../util';
import { MongoDbHelper } from '../db/mongodb/mongodb-helper';

@Injectable()
export class ExtractBiddingApiRepository implements ExtractBiddingRepository {
  constructor(private readonly mongoDbHelper: MongoDbHelper) {}

  async extract(url: string): Promise<ExtractBiddingEntity[]> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao acessar a API de licitações');
      }

      const extractedBids = await response.json();

      const biddingDocument = extractBiddingMapper(extractedBids);

      for (const bidding of biddingDocument) {
        await this.mongoDbHelper.saveExtractedBidding(bidding);
        console.log(
          `*** MongoDB: processo ${bidding.codigoLicitacao} salvo com sucesso`,
        );
      }

      return biddingDocument;
    } catch (error) {
      console.error('Erro durante a extração e salvamento de dados:', error);
    }
  }
}
